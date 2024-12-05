import { Nfse } from "../dfe/nfse/entities/nfse";

export interface NfseSendParams {
    xml: string;
    endpoint: string;
}

export interface NfseResponse {
    protocol: string;
    nfseNumber: string;
    status: string;
    message?: string;
    xml: string;
}

export abstract class NfseProvider {
    abstract transmit(nfse: Nfse): Promise<NfseResponse>;
    abstract cancel(nfse: Nfse, reason: string): Promise<NfseResponse>;
    abstract substitute(nfse: Nfse, substituteReason: string): Promise<NfseResponse>;
    abstract query(nfseNumber: string, protocol: string): Promise<NfseResponse>;
}