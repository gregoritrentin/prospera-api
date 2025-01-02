import { ProcessRpsError } from "./process-rps-error";
import { ProcessRpsWarning } from "./process-rps-warning";

export interface ProcessRpsResponse {
    success: boolean;
    message: string;
    protocol?: string;
    nfseNumber?: string;
    verificationCode?: string;
    issueDate?: Date;
    data?: {
        situation: string;
        serviceAmount: number;
        baseCalculation: number;
        issAmount: number;
        issRate: number;
        deductions?: number;
        netAmount: number;
    };
    errors?: ProcessRpsError[];
    warnings?: ProcessRpsWarning[];
    xml: string;
}