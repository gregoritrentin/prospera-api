export interface PixProps {
    calendario: {
        expiracao?: number;
        dataDeVencimento?: string;
        validadeAposVencimento?: number;
    };
    devedor?: {
        cpf?: string;
        cnpj?: string;
        nome: string;
        logradouro?: string;
        cidade?: string;
        uf?: string;
        cep?: string;
    };
    valor: {
        original: string;
        modalidadeAlteracao?: number;
        multa?: {
            modalidade: string;
            valorPerc: string;
        };
        juros?: {
            modalidade: string;
            valorPerc: string;
        };
        desconto?: {
            modalidade: string;
            descontoDataFixa?: Array<{
                data: string;
                valorPerc: string;
            }>;
        };
    };
    chave: string;
    solicitacaoPagador?: string;
    infoAdicionais?: Array<{ nome: string; valor: string }>;
    loc?: {
        id: number;
    };
}

export interface PixResponse extends PixProps {
    calendario: {
        criacao: string;
        expiracao?: number;
        dataDeVencimento?: string;
        validadeAposVencimento?: number;
    };
    txid: string;
    revisao: number;
    loc: {
        id: number;
        location: string;
        tipoCob: string;
    };
    status: string;
    recebedor?: {
        logradouro: string;
        cidade: string;
        uf: string;
        cep: string;
        cnpj: string;
        nome: string;
    };
}

export abstract class PixProvider {
    abstract createPixImediato(params: PixProps): Promise<PixResponse>;
    abstract createPixVencimento(params: PixProps): Promise<PixResponse>;
    abstract consultPixImediato(txid: string): Promise<PixResponse>;
    abstract consultPixVencimento(txid: string, revisao?: number): Promise<PixResponse>;
    abstract revisePixImediato(txid: string, params: Partial<PixProps>): Promise<PixResponse>;
    abstract revisePixVencimento(txid: string, params: Partial<PixProps>): Promise<PixResponse>;
}