export interface BoletoProps {
    tipoCobranca: 'HIBRIDO';
    pagador: {
        tipoPessoa: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
        documento: string;
        nome: string;
        endereco: string;
        cidade: string;
        uf: string;
        cep: string;
        telefone: string;
        email: string;
    };
    beneficiarioFinal: {
        documento: string;
        tipoPessoa: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
        nome: string;
    };
    especieDocumento: string;
    numeroTitulo: string;
    dataEmissao: string;
    dataVencimento: string;
    seuNumero: string;
    valor: number;
}
export abstract class BoletoProvider {
    abstract createBoleto(params: BoletoProps): Promise<void>
    abstract printBoleto(linhaDigitavel: string): Promise<Buffer>;
    abstract cancelBoleto(nossoNumero: string): Promise<void>;
}
