export interface ProcessRpsRequest {
    businessId: string;
    nfseId: string;
    xml: string;
    originalXml?: string;
}