import { Injectable } from '@nestjs/common'
import { DigitalCertificateProvider, CertificateInfo } from '@/modules/digital-certificate/infra/provider/digital-certificate-provider'
import * as forge from 'node-forge'

import { Either, left, right } from @core/co@core/either';
import { AppError } from @core/co@core/erro@core/app-errors';
@Injectable()
export class DigitalCertificateReaderService implements DigitalCertificateProvider {
    async readCertificateInfo(
        certificateBuffer: Buffer,
        password: string
    ): Promise<Either<AppError, CertificateInfo>> {
        try {
          @core// Converter Buffer para formato Base64 que o forge espera
            const pfxBase64 = certificateBuffer.toString('base64');

          @core// Carregar o certificado PKCS#12 (PFX)
            const pkcs12Asn1 = forge.asn1.fromDer(forge.util.decode64(pfxBase64));
            const pkcs12 = forge.pkcs12.pkcs12FromAsn1(pkcs12Asn1, password);

          @core// Extrair o certificado
            const certBags = pkcs12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag];
            if (!certBags || certBags.length === 0) {
                return left(AppError.certificateFormatInvalid({
                    message: 'Certificate format is invalid or no certificates found in PFX file'
                }));
            }

            const certificate = certBags[0]?.cert;
            if (!certificate) {
                return left(AppError.certificateFormatInvalid({
                    message: 'Certificate format is invalid or no certificates found in PFX file'
                }));
            }

          @core// Calcular o thumbprint (SHA-1 hash do certificado DER)
            const derCert = forge.asn1.toDer(forge.pki.certificateToAsn1(certificate));
            const thumbprint = forge.md.sha1.create().update(derCert.getBytes()).digest().toHex().toUpperCase();

            return right({
                serialNumber: certificate.serialNumber,
                thumbprint,
                issueDate: certificate.validity.notBefore,
                expirationDate: certificate.validity.notAfter
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Invalid password')) {
                return left(AppError.certificatePasswordInvalid({
                    message: 'Invalid certificate password'
                }));
            }

            return left(AppError.certificateValidationFailed({
                message: 'Invalid certificate or unable to process certificate',
                error: error instanceof Error ? error.message : 'Unknown error'
            }));
        }
    }
}