export interface NfseXmlResponse {
    ConsultarNfseRpsResposta?: {
        CompNfse: CompNfse;
        ListaMensagemRetorno?: ListaMensagemRetorno;
    };
    EnviarLoteRpsResposta?: {
        ListaNfse?: {
            CompNfse: CompNfse;
        };
        ListaMensagemRetorno?: ListaMensagemRetorno;
    };
}

export interface CompNfse {
    Nfse: {
        InfNfse: InfNfse;
    };
}

export interface InfNfse {
    Numero: string;
    CodigoVerificacao: string;
    DataEmissao: string;
    NfseCancelamento?: any;
    NfseSubstituicao?: any;
    Servico: {
        Valores: {
            ValorServicos: string;
            ValorDeducoes?: string;
            BaseCalculo: string;
            Aliquota: string;
            ValorIss: string;
            ValorLiquidoNfse: string;
        };
    };
}

export interface ListaMensagemRetorno {
    MensagemRetorno: {
        Codigo: string;
        Mensagem: string;
        Correcao?: string;
    } | Array<{
        Codigo: string;
        Mensagem: string;
        Correcao?: string;
    }>;
}