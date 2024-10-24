export interface PixBaseProps {
    documento: string;
    idTransacao: string;
    dataPagamento: string;
    valorPagamento: number;
    identificadorPagamentoAssociado: string;
    mensagemPix?: string;
    documentoBeneficiario: string;
}

export interface PixChaveProps extends PixBaseProps {
    chavePix: string;
}

export interface PixDadosBancariosProps extends PixBaseProps {
    agenciaBeneficiario: string;
    ispbBeneficiario: string;
    contaBeneficiario: string;
    tipoContaBeneficiario: 'CORRENTE' | 'PAGAMENTO' | 'SALARIO' | 'POUPANCA';
    nomeBeneficiario: string;
}

export interface PixBaseResponse {
    idPagamentoPix: string;
    agenciaBeneficiario: string;
    ispbBeneficiario: string;
    contaBeneficiario: string;
    tipoContaBeneficiario: string;
    nomeBeneficiario: string;
    documentoBeneficiario: string;
    mensagemPix?: string;
    dataPagamento: string;
    identificadorPagamentoAssociado: string;
    valorPagamento: number;
    idTransacao: string;
    status: string;
}

export interface PixChaveResponse extends PixBaseResponse {
    chavePix: string;
}

export type PixDadosBancariosResponse = PixBaseResponse;

export type PixResponse = PixChaveResponse | PixDadosBancariosResponse;

export interface BuscarPixProps {
    idTransacao: string;
}

export abstract class PaymentsProvider {
    abstract criarPixComChave(params: PixChaveProps): Promise<PixResponse>;
    abstract criarPixComDadosBancarios(params: PixDadosBancariosProps): Promise<PixResponse>;
    abstract buscarPixPorIdTransacao(params: BuscarPixProps): Promise<PixResponse>;
    abstract cancelarPixAgendado(params: { idTransacao: string }): Promise<PixResponse>;
    abstract buscarComprovantePix(params: { idTransacao: string }): Promise<Buffer>;
}