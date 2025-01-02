import { Either } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'

// src/domain/digital-certificate/providers/digital-certificate-provider.ts
export interface CertificateInfo {
    serialNumber: string;
    thumbprint: string;
    issueDate: Date;
    expirationDate: Date;
}

export abstract class DigitalCertificateProvider {
    abstract readCertificateInfo(
        certificateBuffer: Buffer,
        password: string
    ): Promise<Either<AppError, CertificateInfo>>;
}