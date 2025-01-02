import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Client, MessageMedia, AuthStrategy, WAState } from 'whatsapp-web.js'
import { WhatsAppProvider, WhatsAppProviderParams } from '@/modules/providers/domain/whatsapp-provider'
import { RedisWhatsAppRepository } from '@/core/infra/database/redis/repositories/redis-whatsapp-repository'
import { RedisService } from '@/core/infra/database/redis/redis.service'
import axios from 'axios'
import * as path from 'path'
import * as fs from 'fs'

class RedisAuthStrategy implements AuthStrategy {
    private redisService: RedisService;
    private clientId: string;
    private logger = new Logger('RedisAuthStrategy');
    private client!: Client;

    constructor(redisService: RedisService, clientId: string) {
        this.redisService = redisService;
        this.clientId = clientId;
    }

    async setup(client: Client) {
        this.client = client;
    }

    async afterAuthReady(): Promise<void> {
        this.logger.log('Auth is ready');
        const state = await this.client.getState();
        await this.redisService.set(`whatsapp:state:${this.clientId}`, state);
    }

    async disconnect(): Promise<void> {
        this.logger.log('Disconnecting auth strategy');
        await this.logout();
        await this.redisService.del(`whatsapp:state:${this.clientId}`);
    }

    async beforeBrowserInitialized() { }

    async afterBrowserInitialized() { }

    async onAuthenticationNeeded(): Promise<{ failed?: boolean; restart?: boolean; failureEventPayload?: any }> {
        this.logger.log('Authentication needed');
        try {
            const state = await this.client.getState();
            this.logger.log(`Current state: ${state}`);
            return {};
        } catch (error) {
            this.logger.error('Error checking state:', error);
            return {};
        }
    }

    async getAuthEventPayload() {
        const session = await this.redisService.get(`whatsapp:auth:${this.clientId}`);
        return session ? JSON.parse(session) : null;
    }

    async beforeAuthRequest() {
        return null;
    }

    async authenticate(sessionData?: any) {
        try {
            if (sessionData) {
                this.logger.log('Saving new session data');
                await this.redisService.set(`whatsapp:auth:${this.clientId}`, JSON.stringify(sessionData));
                return sessionData;
            }

            const savedSession = await this.redisService.get(`whatsapp:auth:${this.clientId}`);
            if (savedSession) {
                this.logger.log('Using saved session data');
                return JSON.parse(savedSession);
            }

            this.logger.log('No session data available');
            return null;
        } catch (error) {
            this.logger.error('Authentication error:', error);
            return null;
        }
    }

    async afterAuthRequest() {
        this.logger.log('Auth request completed');
        const state = await this.client.getState();
        await this.redisService.set(`whatsapp:state:${this.clientId}`, state);
    }

    async logout() {
        await this.redisService.del(`whatsapp:auth:${this.clientId}`);
        await this.redisService.del(`whatsapp:state:${this.clientId}`);
    }

    async destroy() {
        await this.disconnect();
    }
}

@Injectable()
export class WhatsAppService implements WhatsAppProvider, OnModuleInit {
    private client: Client | null = null;
    private connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'PENDING' = 'DISCONNECTED';
    private readonly logger = new Logger(WhatsAppService.name);
    private readonly clientId = 'whatsapp-client';
    private qrCodeRetries = 0;
    private readonly MAX_QR_RETRIES = 5;
    private readonly CACHE_DIR = './.wwebjs_cache';

    constructor(
        private redisWhatsAppRepository: RedisWhatsAppRepository,
        private redisService: RedisService
    ) { }

    async onModuleInit() {
        // Limpar cache antigo na inicialização
        this.cleanCacheDir();
        await this.checkSavedSession();
    }

    private cleanCacheDir() {
        try {
            if (fs.existsSync(this.CACHE_DIR)) {
                fs.rmSync(this.CACHE_DIR, { recursive: true, force: true });
            }
            fs.mkdirSync(this.CACHE_DIR, { recursive: true });
        } catch (error) {
            this.logger.error('Error managing cache directory:', error);
        }
    }

    private async checkSavedSession() {
        const savedStatus = await this.redisWhatsAppRepository.getStatus();
        if (savedStatus === 'CONNECTED') {
            await this.initializeClient();
        } else {
            this.logger.log('No active session found. Use connect() to start a new session.');
        }
    }

    private async initializeClient() {
        if (this.client) {
            return;
        }

        await this.redisWhatsAppRepository.clearAll();
        this.qrCodeRetries = 0;
        this.cleanCacheDir();

        const authStrategy = new RedisAuthStrategy(this.redisService, this.clientId);

        this.client = new Client({
            authStrategy,
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                    '--disable-extensions',
                    '--disable-software-rasterizer'
                ],
                userDataDir: this.CACHE_DIR
            },
            qrMaxRetries: this.MAX_QR_RETRIES,
            takeoverOnConflict: true,
            takeoverTimeoutMs: 60000,
            webVersionCache: {
                type: 'local',
                path: this.CACHE_DIR
            }
        });

        this.setupEventListeners(this.client, authStrategy);

        try {
            this.logger.log('Starting WhatsApp client initialization...');
            await this.client.initialize();
            this.logger.log('WhatsApp client initialization completed');
        } catch (error) {
            this.logger.error('Failed to initialize WhatsApp client:', error);
            await this.cleanupOnError();
            throw new Error('Failed to initialize WhatsApp client');
        }
    }

    private setupEventListeners(client: Client, authStrategy: RedisAuthStrategy) {
        client.on('qr', async (qr) => {
            this.qrCodeRetries++;
            this.logger.log(`QR Code received (attempt ${this.qrCodeRetries} of ${this.MAX_QR_RETRIES})`);

            this.connectionStatus = 'PENDING';
            await this.redisWhatsAppRepository.setQR(qr);
            await this.redisWhatsAppRepository.setStatus('PENDING');

            if (this.qrCodeRetries >= this.MAX_QR_RETRIES) {
                this.logger.warn('Max QR code retries reached. Reinitializing client...');
                await this.cleanupOnError();
                await this.initializeClient();
            }
        });

        client.on('ready', async () => {
            this.qrCodeRetries = 0;
            this.connectionStatus = 'CONNECTED';
            await this.redisWhatsAppRepository.setStatus('CONNECTED');
            await this.redisWhatsAppRepository.clearQR();
            this.logger.log('WhatsApp client is ready and connected');
        });

        client.on('loading_screen', (percent, message) => {
            this.logger.log(`Loading screen: ${percent}% - ${message}`);
        });

        client.on('change_state', async (state) => {
            this.logger.log(`State changed to: ${state}`);
        });

        client.on('disconnected', async (reason) => {
            this.logger.warn(`WhatsApp client disconnected. Reason: ${reason}`);
            this.connectionStatus = 'DISCONNECTED';
            await this.redisWhatsAppRepository.setStatus('DISCONNECTED');
            await authStrategy.logout();
            await this.cleanupOnError();
        });

        client.on('authenticated', async (session) => {
            this.qrCodeRetries = 0;
            this.logger.log('WhatsApp client authenticated successfully');
            await authStrategy.authenticate(session);
            await this.redisWhatsAppRepository.setSession(JSON.stringify(session));
        });

        client.on('auth_failure', async (error) => {
            this.logger.error('Authentication failed:', error);
            await this.cleanupOnError();
        });
    }

    private async cleanupOnError() {
        if (this.client) {
            try {
                await this.client.destroy();
            } catch (error) {
                this.logger.error('Error destroying client:', error);
            }
        }

        this.client = null;
        this.connectionStatus = 'DISCONNECTED';
        await this.redisWhatsAppRepository.setStatus('DISCONNECTED');
        await this.redisWhatsAppRepository.clearAll();
        this.cleanCacheDir();
    }

    async connect(): Promise<string> {
        try {
            if (this.connectionStatus === 'CONNECTED') {
                return 'Already connected';
            }

            if (!this.client) {
                await this.initializeClient();
            }

            const qr = await this.redisWhatsAppRepository.getQR();
            if (qr) {
                return qr;
            }

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    cleanup();
                    reject(new Error('Connection timeout after 30 seconds'));
                }, 30000);

                const cleanup = () => {
                    clearTimeout(timeout);
                    this.client?.removeListener('qr', qrHandler);
                    this.client?.removeListener('ready', readyHandler);
                    this.client?.removeListener('auth_failure', authFailureHandler);
                };

                const qrHandler = (qr: string) => {
                    cleanup();
                    resolve(qr);
                };

                const readyHandler = () => {
                    cleanup();
                    resolve('Connected successfully');
                };

                const authFailureHandler = (error: Error) => {
                    cleanup();
                    reject(error);
                };

                this.client!.on('qr', qrHandler);
                this.client!.on('ready', readyHandler);
                this.client!.on('auth_failure', authFailureHandler);
            });
        } catch (error) {
            this.logger.error('Connection error:', error);
            throw new Error('Falha ao conectar ao WhatsApp');
        }
    }

    async send(params: WhatsAppProviderParams): Promise<{ sendId: string }> {
        if (!this.client || this.connectionStatus !== 'CONNECTED') {
            throw new Error('WhatsApp is not connected. Use connect() method first.');
        }

        const formattedNumber = params.to.includes('@c.us') ? params.to : `${params.to}@c.us`;
        try {
            this.logger.log(`Sending text message to ${formattedNumber}`);
            const message = await this.client.sendMessage(formattedNumber, params.content);
            this.logger.log(`Text message sent successfully. MessageId: ${message.id.id}`);
            return { sendId: message.id.id };
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp message to ${formattedNumber}:`, error);
            throw new Error('Failed to send WhatsApp message');
        }
    }

    async sendMedia(
        to: string,
        mediaUrl: string,
        mediaType: string,
        content: string
    ): Promise<{ sendId: string }> {
        if (!this.client || this.connectionStatus !== 'CONNECTED') {
            throw new Error('WhatsApp is not connected. Use connect() method first.');
        }

        const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`;
        try {
            this.logger.log(`Downloading media from ${mediaUrl}`);
            const { data } = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
            const fileName = this.getFileNameFromUrl(mediaUrl) || `file.${this.getExtensionFromMimeType(mediaType)}`;
            const media = new MessageMedia(mediaType, Buffer.from(data).toString('base64'), fileName);

            this.logger.log(`Sending media message to ${formattedNumber}`);
            let message;
            if (mediaType.startsWith('audio/')) {
                message = await this.client.sendMessage(formattedNumber, media, { sendAudioAsVoice: true });
            } else {
                message = await this.client.sendMessage(formattedNumber, media, { caption: content });
            }

            this.logger.log(`Media message sent successfully. MessageId: ${message.id.id}`);
            return { sendId: message.id.id };
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp media to ${formattedNumber}:`, error);
            throw new Error('Failed to send WhatsApp media');
        }
    }

    async getConnectionStatus(): Promise<'CONNECTED' | 'DISCONNECTED' | 'PENDING'> {
        return this.connectionStatus;
    }

    private getFileNameFromUrl(url: string): string {
        try {
            const urlPath = new URL(url).pathname;
            return path.basename(urlPath);
        } catch {
            return '';
        }
    }

    private getExtensionFromMimeType(mimeType: string): string {
        const extensions = {
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'audio/mpeg': 'mp3',
            'video/mp4': 'mp4'
        };
        return extensions[mimeType] || 'bin';
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            try {
                await this.client.destroy();
                this.client = null;
                this.connectionStatus = 'DISCONNECTED';
                await this.redisWhatsAppRepository.setStatus('DISCONNECTED');
                await this.redisWhatsAppRepository.clearAll();
                this.cleanCacheDir();
                this.logger.log('WhatsApp client disconnected successfully');
            } catch (error) {
                this.logger.error('Error during disconnect:', error);
                throw new Error('Failed to disconnect WhatsApp client');
            }
        }
    }

    async isRegisteredUser(phoneNumber: string): Promise<boolean> {
        if (!this.client || this.connectionStatus !== 'CONNECTED') {
            throw new Error('WhatsApp is not connected. Use connect() method first.');
        }

        const formattedNumber = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
        try {
            const isRegistered = await this.client.isRegisteredUser(formattedNumber);
            return isRegistered;
        } catch (error) {
            this.logger.error(`Failed to check if user is registered: ${formattedNumber}:`, error);
            throw new Error('Failed to check user registration status');
        }
    }
}