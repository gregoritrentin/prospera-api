import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EnvService } from '../config/env.service'
import { I18nService } from '@/i18n/i18n.service'
import { BoletoProvider, BoletoProps } from '@/modules/providers/domain/boleto-provider'

import axios, { AxiosInstance } from 'axios';
interface CreateBoletoRequest {
  tipoCobranca: 'NORMAL' | 'HIBRIDO';
  pagador: {
    tipoPessoa: 'PESSOA_JURIDICA' | 'PESSOA_FISICA';
    documento: string;
    nome: string;
    endereco?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
    telefone?: string;
    email?: string;
  };
  beneficiarioFinal?: {
    documento: string;
    tipoPessoa: 'PESSOA_JURIDICA' | 'PESSOA_FISICA';
    nome: string;
  };
  especieDocumento: string;
  numeroTitulo: string;
  dataEmissao: string;
  dataVencimento: string;
  seuNumero?: string;
  valor: number;
}

@Injectable()
export class SicrediBoletoService implements BoletoProvider, OnModuleInit {
  private api: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private refreshTokenExpiresAt: number = 0;
  private readonly logger = new Logger(SicrediBoletoService.name);
  private readonly TOKEN_BUFFER = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly envService: EnvService,
    private readonly i18nService: I18nService
  ) {
    this.api = axios.create({
      baseURL: `${this.envService.get('SICREDI_BOLETO_API')}/cobranca/boleto/v1`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': this.envService.get('SICREDI_API_KEY'),
        'context': 'COBRANCA',
      },
    });

    this.api.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      config.headers['Authorization'] = `Bearer ${this.accessToken}`;
      return config;
    });
  }

  async onModuleInit() {
    try {
      //await this.authenticate();
    } catch (error) {
      this.logger.error('Failed to initialize SicrediService', error);
    }
  }

  private async ensureValidToken(): Promise<void> {
    const now = Date.now();

    if (this.accessToken && now < this.tokenExpiresAt - this.TOKEN_BUFFER) {
      return;
    }

    if (this.refreshToken && now < this.refreshTokenExpiresAt - this.TOKEN_BUFFER) {
      await this.refreshAccessToken();
    } else {
      await this.authenticate();
    }
  }

  private async authenticate(): Promise<void> {
    const username = `${this.envService.get('SICREDI_BENEFICIARIO')}${this.envService.get('SICREDI_COOPERATIVA')}`;
    const password = this.envService.get('SICREDI_CODIGO_ACESSO') || '';
    const authUrl = `${this.envService.get('SICREDI_BOLETO_API')}/auth/openapi/token`;

    try {
      const response = await axios.post(authUrl,
        new URLSearchParams({
          grant_type: 'password',
          username,
          password,
          scope: 'cobranca'
        }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': this.envService.get('SICREDI_API_KEY'),
          'context': 'COBRANCA'
        }
      });

      this.updateTokens(response.data);
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      throw new Error(this.i18nService.translate('sicredi.error.authentication'));
    }
  }

  private async refreshAccessToken(): Promise<void> {
    this.logger.log('Refreshing access token');
    try {
      const response = await axios.post(`${this.envService.get('SICREDI_BOLETO_API')}/auth/openapi/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken!,
          scope: 'cobranca'
        }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': this.envService.get('SICREDI_API_KEY'),
          'context': 'COBRANCA'
        }
      });

      this.updateTokens(response.data);
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      this.refreshToken = null;
      await this.authenticate();
    }
  }

  private updateTokens(data: any): void {
    const now = Date.now();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.tokenExpiresAt = now + (data.expires_in * 1000);
    this.refreshTokenExpiresAt = now + (data.refresh_expires_in * 1000);
  }

  async createBoleto(params: BoletoProps): Promise<any> {
    try {
      await this.ensureValidToken();

      const codigoBeneficiario = this.envService.get('SICREDI_BENEFICIARIO');

      const request: CreateBoletoRequest = {
        tipoCobranca: params.tipoCobranca,
        pagador: params.pagador,
        beneficiarioFinal: params.beneficiarioFinal,
        especieDocumento: params.especieDocumento,
        numeroTitulo: params.numeroTitulo,
        dataEmissao: params.dataEmissao,
        dataVencimento: params.dataVencimento,
        seuNumero: params.seuNumero,
        valor: params.valor
      };

      const fullRequest = {
        ...request,
        codigoBeneficiario
      };

      const response = await this.api.post('/boletos', fullRequest, {
        headers: {
          'cooperativa': this.envService.get('SICREDI_COOPERATIVA'),
          'posto': this.envService.get('SICREDI_POSTO'),
        }
      });

      return response.data;

    } catch (error) {
      this.handleBoletoError(error, 'criar');
    }
  }

  async cancelBoleto(nossoNumero: string): Promise<void> {
    try {
      await this.ensureValidToken();

      const response = await this.api.patch(`/boletos/${nossoNumero}/baixa`, {}, {
        headers: {
          'cooperativa': this.envService.get('SICREDI_COOPERATIVA'),
          'posto': this.envService.get('SICREDI_POSTO'),
          'codigoBeneficiario': this.envService.get('SICREDI_BENEFICIARIO'),
        }
      });

      return response.data;

    } catch (error) {
      this.handleBoletoError(error, 'cancelar');
    }
  }

  async printBoleto(linhaDigitavel: string): Promise<Buffer> {
    try {
      await this.ensureValidToken();

      const response = await this.api.get(`/boletos/pdf`, {
        params: { linhaDigitavel },
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      this.handleBoletoError(error, 'imprimir');
    }
  }

  private handleBoletoError(error: any, action: string): never {
    const actionKey = `sicredi.error.${action}`;
    const errorMessage = this.i18nService.translate(actionKey, undefined, {
      defaultValue: `Erro ao ${action} boleto no Sicredi`
    });

    this.logger.error(`${errorMessage}:`, error);

    if (axios.isAxiosError(error)) {
      this.logger.error('Response data:', error.response?.data);
      this.logger.error('Response status:', error.response?.status);
    }

    const fullErrorMessage = this.i18nService.translate('sicredi.error.full', undefined, {
      action: this.i18nService.translate(actionKey, undefined, { defaultValue: action }),
      errorDetail: error.message
    });

    throw new Error(fullErrorMessage);
  }
}