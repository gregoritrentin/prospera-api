import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { I18nService } from '@/i18n/i18n.service';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as https from 'https';
import {
    PaymentsProvider,
    PixChaveProps,
    PixDadosBancariosProps,
    PixResponse
} from '@/domain/providers/payments-provider';

@Injectable()
export class SicrediMultipagService implements PaymentsProvider, OnModuleInit {
    private api: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;
    private readonly logger = new Logger(SicrediMultipagService.name);
    private readonly TOKEN_BUFFER = 5 * 60 * 1000; // 5 minutos
    private readonly AUTH_BASE_URL: string;
    private readonly API_BASE_URL: string;

    constructor(
        private readonly envService: EnvService,
        private readonly i18nService: I18nService
    ) {
        this.AUTH_BASE_URL = this.envService.get('SICREDI_MULTIPAG_AUTH');
        this.API_BASE_URL = this.envService.get('SICREDI_MULTIPAG_API');

        const httpsAgent = this.createHttpsAgent();

        this.api = axios.create({
            httpsAgent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
            },
        });
    }

    private createHttpsAgent(): https.Agent {
        try {
            const certContent = this.envService.get('SICREDI_CERT');
            const keyContent = this.envService.get('SICREDI_KEY');
            const caContent = this.envService.get('SICREDI_CA');

            if (!certContent) throw new Error('Conteúdo do certificado não encontrado na variável de ambiente SICREDI_CERT');
            if (!keyContent) throw new Error('Conteúdo da chave não encontrado na variável de ambiente SICREDI_KEY');
            if (!caContent) throw new Error('Conteúdo do CA não encontrado na variável de ambiente SICREDI_CA');

            const cert = Buffer.from(certContent, 'base64');
            const key = Buffer.from(keyContent, 'base64');
            const ca = Buffer.from(caContent, 'base64');

            this.logger.debug('Certificados decodificados com sucesso');

            return new https.Agent({
                cert,
                key,
                ca,
                rejectUnauthorized: false // Desabilita temporariamente a verificação de certificados
            });
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Erro ao criar o agente HTTPS: ${error.message}`);
            } else {
                this.logger.error('Ocorreu um erro desconhecido ao criar o agente HTTPS');
            }
            throw new Error('Falha ao criar o agente HTTPS com os certificados fornecidos');
        }
    }

    async onModuleInit() {
        try {
            this.logger.log('Inicializando módulo, tentando autenticação');
            await this.authenticate();
        } catch (error) {
            this.logger.error('Falha ao inicializar SicrediMultipagService', error);
        }
    }

    private async authenticate(): Promise<void> {
        const clientId = this.envService.get('SICREDI_MULTIPAG_CLIENT_ID');
        const clientSecret = this.envService.get('SICREDI_MULTIPAG_CLIENT_SECRET');
        const authUrl = `${this.AUTH_BASE_URL}/auth/token`;

        this.logger.log(`Autenticando com a API Sicredi Multipag. URL de autenticação: ${authUrl}`);

        try {
            const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('scope', 'multipag.boleto.pagar multipag.boleto.consultar multipag.tributos.pagar multipag.tributos.consultar multipag.pix.pagar multipag.pix.consultar');

            const response = await this.api.post(authUrl, params, {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
            this.logger.log(`Autenticação bem-sucedida. Token expira em: ${new Date(this.tokenExpiresAt).toISOString()}`);
        } catch (error) {
            this.logger.error('Falha na autenticação:', error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                this.logger.error('Status da resposta:', axiosError.response?.status);
                this.logger.error('Dados da resposta:', axiosError.response?.data);
            }
            throw new Error(this.i18nService.translate('sicredi.error.authentication'));
        }
    }

    private async ensureValidToken(): Promise<void> {
        const now = Date.now();
        if (!this.accessToken || now >= this.tokenExpiresAt - this.TOKEN_BUFFER) {
            this.logger.log('Token expirado ou prestes a expirar, reautenticando');
            await this.authenticate();
        }
    }

    private isSandboxEnvironment(): boolean {
        return this.API_BASE_URL.includes('/sb/');
    }

    async criarPixComChave(params: PixChaveProps): Promise<PixResponse> {
        this.logger.log('Criando pagamento PIX com chave');
        this.logger.debug('Parâmetros de entrada:', JSON.stringify(params, null, 2));

        const isSandbox = this.isSandboxEnvironment();
        this.logger.log(`Ambiente detectado: ${isSandbox ? 'Sandbox' : 'Produção'}`);

        const dataPagamento = new Date().toISOString().split('T')[0];

        const payload = {

            conta: isSandbox ? '000001' : this.envService.get('SICREDI_COOPERATIVA'),
            cooperativa: isSandbox ? '0100' : this.envService.get('SICREDI_BENEFICIARIO'),
            dataPagamento: isSandbox ? dataPagamento : params.dataPagamento,
            documento: isSandbox ? '11111111000111' : params.documento,
            documentoBeneficiario: isSandbox ? '11111111111' : params.documentoBeneficiario,
            identificadorPagamentoAssociado: isSandbox ? 'EMP:001' : params.identificadorPagamentoAssociado,
            idTransacao: isSandbox ? '0910F3HT1' : params.idTransacao,
            chavePix: isSandbox ? '+5511999999999' : params.chavePix,
            mensagemPix: isSandbox ? 'Pagamento ordem 001' : (params.mensagemPix || undefined),
            valorPagamento: isSandbox ? 20.1 : Number(params.valorPagamento)

        };

        this.logger.debug('Payload preparado:', JSON.stringify(payload, null, 2));

        const url = `${this.API_BASE_URL}/pagamentos/pix/chave`;

        return this.executePixRequest(url, payload);
    }

    async criarPixComDadosBancarios(params: PixDadosBancariosProps): Promise<PixResponse> {
        this.logger.log('Criando pagamento PIX com dados bancários');
        this.logger.debug('Parâmetros de entrada:', JSON.stringify(params, null, 2));

        const isSandbox = this.isSandboxEnvironment();
        this.logger.log(`Ambiente detectado: ${isSandbox ? 'Sandbox' : 'Produção'}`);

        const dataPagamento = new Date().toISOString().split('T')[0];

        const payload = {
            conta: isSandbox ? '000001' : this.envService.get('SICREDI_COOPERATIVA'),
            cooperativa: isSandbox ? '0100' : this.envService.get('SICREDI_BENEFICIARIO'),
            documento: isSandbox ? '11111111000111' : params.documento,
            idTransacao: isSandbox ? '0810AA1HJ1' : params.idTransacao,
            dataPagamento: isSandbox ? dataPagamento : params.dataPagamento,
            agenciaBeneficiario: isSandbox ? '0101' : params.agenciaBeneficiario,
            ispbBeneficiario: isSandbox ? '91586982' : params.ispbBeneficiario,
            contaBeneficiario: isSandbox ? '011119' : params.contaBeneficiario,
            valorPagamento: isSandbox ? 51.22 : Number(params.valorPagamento),
            tipoContaBeneficiario: isSandbox ? 'CORRENTE' : params.tipoContaBeneficiario,
            identificadorPagamentoAssociado: isSandbox ? 'EMP:006' : params.identificadorPagamentoAssociado,
            nomeBeneficiario: isSandbox ? 'Anderson Silva' : params.nomeBeneficiario,
            documentoBeneficiario: isSandbox ? '11111111111' : params.documentoBeneficiario,
            mensagemPix: isSandbox ? 'Pagamento disponivel' : (params.mensagemPix || undefined)
        };

        this.logger.debug('Payload preparado:', JSON.stringify(payload, null, 2));

        const url = `${this.API_BASE_URL}/pagamentos/pix/dados-bancarios`;

        return this.executePixRequest(url, payload);
    }

    async buscarPixPorIdTransacao(params: { idTransacao: string }): Promise<PixResponse> {
        this.logger.log('Buscando pagamento PIX por ID de transação');
        this.logger.debug('Parâmetros de entrada:', JSON.stringify(params, null, 2));

        const isSandbox = this.isSandboxEnvironment();
        this.logger.log(`Ambiente detectado: ${isSandbox ? 'Sandbox' : 'Produção'}`);

        const url = `${this.API_BASE_URL}/pagamentos/pix/${params.idTransacao}`;

        try {
            await this.ensureValidToken();
            this.logger.log(`Enviando requisição de busca PIX para: ${url}`);

            const startTime = Date.now();
            const response = await this.api.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': '*/*',
                    'x-cooperativa': isSandbox ? '0100' : this.envService.get('SICREDI_COOPERATIVA'),
                    'x-conta': isSandbox ? '000001' : this.envService.get('SICREDI_BENEFICIARIO'),
                    'x-documento': isSandbox ? '11111111000111' : '07350773000147'
                }
            });
            const endTime = Date.now();

            this.logger.log(`Pagamento PIX encontrado com sucesso. Tempo de resposta: ${endTime - startTime}ms`);
            this.logger.debug('Resposta da busca PIX:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                this.logger.error('Erro ao buscar Pagamento PIX:', error.message);
                this.logger.error('Status do erro:', status);
                this.logger.error('Dados do erro:', JSON.stringify(error.response?.data, null, 2));
                this.logger.error('URL da requisição:', url);
                this.logger.error('Método da requisição:', 'GET');
                this.logger.error('Headers da requisição:', JSON.stringify(error.config?.headers, null, 2));

                this.handlePixError(error);
            } else {
                this.logger.error('Erro não-Axios ao buscar Pagamento PIX:', error);
                throw error;
            }
        }
    }

    async cancelarPixAgendado(params: { idTransacao: string }): Promise<PixResponse> {
        this.logger.log('Cancelando pagamento PIX agendado');
        this.logger.debug('Parâmetros de entrada:', JSON.stringify(params, null, 2));

        const isSandbox = this.isSandboxEnvironment();
        this.logger.log(`Ambiente detectado: ${isSandbox ? 'Sandbox' : 'Produção'}`);

        const url = `${this.API_BASE_URL}/pagamentos/pix/${params.idTransacao}/cancelar`;

        try {
            await this.ensureValidToken();
            this.logger.log(`Enviando requisição de cancelamento PIX para: ${url}`);

            const startTime = Date.now();
            const response = await this.api.post(url, null, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': '*/*',
                    'x-cooperativa': isSandbox ? '0100' : this.envService.get('SICREDI_COOPERATIVA'),
                    'x-conta': isSandbox ? '000001' : this.envService.get('SICREDI_BENEFICIARIO'),
                    'x-documento': isSandbox ? '11111111000111' : '07350773000147'
                }
            });
            const endTime = Date.now();

            this.logger.log(`Pagamento PIX cancelado com sucesso. Tempo de resposta: ${endTime - startTime}ms`);
            this.logger.debug('Resposta do cancelamento PIX:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                this.logger.error('Erro ao cancelar Pagamento PIX:', error.message);
                this.logger.error('Status do erro:', status);
                this.logger.error('Dados do erro:', JSON.stringify(error.response?.data, null, 2));
                this.logger.error('URL da requisição:', url);
                this.logger.error('Método da requisição:', 'POST');
                this.logger.error('Headers da requisição:', JSON.stringify(error.config?.headers, null, 2));

                this.handlePixError(error);
            } else {
                this.logger.error('Erro não-Axios ao cancelar Pagamento PIX:', error);
                throw error;
            }
        }
    }

    async buscarComprovantePix(params: { idTransacao: string }): Promise<Buffer> {
        this.logger.log('Buscando comprovante PIX');
        this.logger.debug('Parâmetros de entrada:', JSON.stringify(params, null, 2));

        const isSandbox = this.isSandboxEnvironment();
        this.logger.log(`Ambiente detectado: ${isSandbox ? 'Sandbox' : 'Produção'}`);

        const url = `${this.API_BASE_URL}/pagamentos/pix/${params.idTransacao}/comprovante`;

        try {
            await this.ensureValidToken();
            this.logger.log(`Enviando requisição de busca de comprovante PIX para: ${url}`);

            const response = await this.api.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/pdf',
                    'x-cooperativa': isSandbox ? '0100' : this.envService.get('SICREDI_COOPERATIVA'),
                    'x-conta': isSandbox ? '000001' : this.envService.get('SICREDI_BENEFICIARIO'),
                    'x-documento': isSandbox ? '11111111000111' : '07350773000147'
                },
                responseType: 'arraybuffer'
            });

            this.logger.log('Comprovante PIX obtido com sucesso');

            // Verifique se a resposta é um ArrayBuffer
            if (response.data instanceof ArrayBuffer) {
                return Buffer.from(response.data);
            } else {
                throw new Error('A resposta não é um ArrayBuffer válido');
            }
        } catch (error) {
            this.logger.error('Erro ao buscar comprovante PIX:', error);
            throw new Error(this.i18nService.translate('errors.PIX_PROOF_FETCH_FAILED'));
        }
    }

    private async executePixRequest(url: string, payload: any): Promise<PixResponse> {
        try {
            await this.ensureValidToken();
            this.logger.log(`Enviando requisição PIX para: ${url}`);
            this.logger.debug('Payload da requisição:', JSON.stringify(payload, null, 2));
            this.logger.debug('Headers da requisição:', JSON.stringify({
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }, null, 2));

            const startTime = Date.now();
            const response = await this.api.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });
            const endTime = Date.now();

            this.logger.log(`Pagamento PIX criado com sucesso. Tempo de resposta: ${endTime - startTime}ms`);
            this.logger.debug('Resposta do pagamento PIX:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                this.logger.error('Erro ao criar Pagamento PIX:', error.message);
                this.logger.error('Status do erro:', status);
                this.logger.error('Dados do erro:', JSON.stringify(error.response?.data, null, 2));
                this.logger.error('URL da requisição:', url);
                this.logger.error('Método da requisição:', 'POST');
                this.logger.error('Headers da requisição:', JSON.stringify(error.config?.headers, null, 2));

                this.handlePixError(error);
            } else {
                this.logger.error('Erro não-Axios ao criar Pagamento PIX:', error);
                throw error;
            }
        }
    }

    private handlePixError(error: AxiosError): never {
        const status = error.response?.status;
        const data = error.response?.data;

        switch (status) {
            case 400:
                throw new Error(`Parâmetros de entrada incorretos: ${JSON.stringify(data)}`);
            case 401:
                throw new Error('Token inválido ou expirado');
            case 403:
                throw new Error('Acesso não autorizado ao recurso');
            case 422:
                throw new Error(`Erro de regra de negócio: ${JSON.stringify(data)}`);
            case 500:
                throw new Error(`Erro interno do servidor: ${JSON.stringify(data)}`);
            default:
                throw new Error(`Erro desconhecido: ${JSON.stringify(data)}`);
        }
    }

}