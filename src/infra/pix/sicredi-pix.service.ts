import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { I18nService } from '@/i18n/i18n.service';
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as https from 'https';

@Injectable()
export class SicrediPixService implements OnModuleInit {
    private api: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;
    private readonly logger = new Logger(SicrediPixService.name);
    private readonly TOKEN_BUFFER = 5 * 60 * 1000; // 5 minutos

    constructor(
        private readonly envService: EnvService,
        private readonly i18nService: I18nService
    ) {
        this.logger.log('Inicializando SicrediPixService');
        const apiUrl = this.envService.get('SICREDI_PIX_API');
        this.logger.log(`URL da API: ${apiUrl}`);

        const httpsAgent = this.createHttpsAgent();

        this.api = axios.create({
            baseURL: apiUrl,
            httpsAgent: httpsAgent,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    }

    private createHttpsAgent(): https.Agent {
        try {
            const certContent = this.envService.get('SICREDI_CERT');
            const keyContent = this.envService.get('SICREDI_KEY');
            const caContent = this.envService.get('SICREDI_CA');

            // this.logger.debug(`Certificado presente: ${!!certContent}`);
            // this.logger.debug(`Chave privada presente: ${!!keyContent}`);
            // this.logger.debug(`CA presente: ${!!caContent}`);

            // this.logger.debug(`Tamanho do conteúdo do certificado: ${certContent?.length || 0}`);
            // this.logger.debug(`Tamanho do conteúdo da chave: ${keyContent?.length || 0}`);
            // this.logger.debug(`Tamanho do conteúdo do CA: ${caContent?.length || 0}`);

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
                rejectUnauthorized: false // Temporariamente para teste
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
            this.logger.error('Falha ao inicializar SicrediPixService', error);
        }
    }

    private async authenticate(): Promise<void> {
        const clientId = this.envService.get('SICREDI_CLIENT_ID');
        const clientSecret = this.envService.get('SICREDI_CLIENT_SECRET');
        const authUrl = `${this.envService.get('SICREDI_PIX_API')}/oauth/token`;

        this.logger.log(`Autenticando com a API Sicredi. URL de autenticação: ${authUrl}`);

        try {
            const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

            const response = await this.api.post(authUrl, null, {
                params: {
                    grant_type: 'client_credentials',
                    scope: 'cob.write cob.read webhook.read webhook.write'
                },
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
                this.logger.error('Configuração da requisição:',
                    JSON.stringify(axiosError.config, (key, value) => {
                        if (key === 'socket' || key === '_httpMessage') {
                            return '[Circular]';
                        }
                        return value;
                    }, 2)
                );
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

    async createPixImediato(params: any): Promise<any> {
        await this.ensureValidToken();
        try {
            // this.logger.log('Criando Pix Imediato');
            // this.logger.debug('Parâmetros recebidos:', JSON.stringify(params, null, 2));

            const txid = this.generateTxid();
            const url = `/api/v2/cob/${txid}`;

            const payload = {
                calendario: params.calendario || { expiracao: 3600 },
                valor: params.valor,
                chave: params.chave || this.envService.get('SICREDI_CHAVE_PIX')
            };

            // if (params.devedor) {
            //     payload.devedor = params.devedor;
            // }

            // if (params.solicitacaoPagador) {
            //     payload.solicitacaoPagador = params.solicitacaoPagador;
            // }

            // this.logger.debug('Payload do Pix Imediato:', JSON.stringify(payload, null, 2));
            // this.logger.debug(`URL da requisição: ${url}`);

            const response = await this.api.put(url, payload, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });

            //this.logger.log('Pix Imediato criado com sucesso');
            //this.logger.debug('Resposta do Pix Imediato:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            this.logger.error('Erro ao criar Pix Imediato:', error);
            if (axios.isAxiosError(error)) {
                this.logger.error('Detalhes do erro da API:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw this.handlePixError(error, 'criar');
        }
    }

    async consultPixImediato(txid: string): Promise<any> {
        await this.ensureValidToken();
        try {
            this.logger.log(`Consultando Pix Imediato com txid: ${txid}`);
            const response = await this.api.get(`/api/v2/cob/${txid}`, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            this.logger.log('Pix Imediato consultado com sucesso');
            this.logger.debug('Resposta da consulta do Pix Imediato:', response.data);
            return response.data;
        } catch (error) {
            this.handlePixError(error, 'consultar');
        }
    }

    private handlePixError(error: any, action: string): Error {
        const actionKey = `sicredi.error.${action}`;
        let errorMessage = this.i18nService.translate(actionKey, undefined, {
            defaultValue: `Erro ao ${action} Pix no Sicredi`
        });

        let detailedError = '';

        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            detailedError = `Status: ${status}, `;

            if (typeof data === 'object' && data !== null) {
                detailedError += `Tipo: ${data.type || 'N/A'}, `;
                detailedError += `Título: ${data.title || 'N/A'}, `;
                detailedError += `Detalhe: ${data.detail || 'N/A'}, `;
                if (data.violacoes && Array.isArray(data.violacoes)) {
                    detailedError += 'Violações: ' + data.violacoes.map((v: any) =>
                        `${v.propriedade}: ${v.razao}`
                    ).join('; ');
                }
            } else {
                detailedError += `Data: ${JSON.stringify(data)}`;
            }
        } else if (error instanceof Error) {
            detailedError = `${error.name}: ${error.message}`;
        } else {
            detailedError = JSON.stringify(error);
        }

        const fullErrorMessage = `${errorMessage}\nDetalhes: ${detailedError}`;

        return new Error(fullErrorMessage);
    }

    private generateTxid(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const length = 32; // Escolhemos um comprimento fixo dentro do intervalo válido (26-35)
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}