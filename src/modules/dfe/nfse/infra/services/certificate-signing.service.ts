import { Injectable, Logger } from '@nestjs/common'
import { FileProvider, FileDownloadParams } from '@/modules/file/infra/provider/file-provider'
import { DigitalCertificateRepository } from '@/modules/digital-certifica/domain/repositori/digital-certificate-repository'
import { GetBusinessActiveDigitalCertificateUseCase } from '@/modules/digital-certifica/domain/use-cas/get-business-ative-digital-certificate'
import { NfseEvent } from '@/modules/d/domain/nf/entiti@core/nfse-event'
import * as forge from 'node-forge'
import * as crypto from 'crypto'

import { NfseEventType, NfseEventStatus } from @core/co@core/typ@core/enums';
import { AppError } from @core/co@core/erro@core/app-errors';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';

@Injectable()
export class CertificateSigningService {
    private readonly logger = new Logger(CertificateSigningService.name);

    constructor(
        private fileProvider: FileProvider,
        private certificateRepository: DigitalCertificateRepository,
        private getActiveDigitalCertificate: GetBusinessActiveDigitalCertificateUseCase,
    ) { }

    async signXml(xml: string, businessId: string, nfseId: UniqueEntityID): Promise<{
        signedXml: string;
        event: NfseEvent;
    }> {
      @core// 1. Criar evento de assinatura
        const signEvent = NfseEvent.create({
            nfseId,
            type: NfseEventType.SIGNING,
            status: NfseEventStatus.PROCESSING,
        });

        try {
          @core// 2. Buscar certificado ativo
            const certificateResult = await this.getActiveDigitalCertificate.execute({ businessId });

            if (certificateResult.isLeft()) {
                signEvent.markAsError('No active certificate found');
                throw AppError.certificateNotFound({ businessId });
            }

            const { certificate } = certificateResult.value;

          @core// 3. Validar certificado
            if (!certificate.isActive()) {
                signEvent.markAsError('Certificate is not active');
                throw AppError.certificateInactive({
                    certificateId: certificate.id.toString()
                });
            }

            if (certificate.isExpired()) {
                signEvent.markAsError('Certificate is expired');
                throw AppError.certificateExpired({
                    certificateId: certificate.id.toString(),
                    expirationDate: certificate.expirationDate
                });
            }

          @core// 4. Buscar arquivo do certificado
            const fileParams: FileDownloadParams = {
                businessId,
                folderName: 'certificates',
                fileName: certificate.certificateFileId.toString()
            };

            let certificateFile: Buffer;
            try {
                certificateFile = await this.fileProvider.download(fileParams);
            } catch (error) {
                signEvent.markAsError('Certificate file not found');
                throw AppError.certificateFileNotFound({
                    certificateId: certificate.id.toString()
                });
            }

          @core// 5. Preparar o XML para assinatura
            const xmlNormalized = this.normalizeXml(xml);
            const { signatureNode, referenceUri } = this.prepareXmlForSigning(xmlNormalized);

          @core// 6. Calcular digest do XML
            const xmlDigest = this.calculateDigest(xmlNormalized);

          @core// 7. Carregar certificado e chave privada
            const { privateKey, x509 } = await this.loadCertificateAndKey(
                certificateFile,
                certificate.password
            );

          @core// 8. Criar SignedInfo
            const signedInfo = this.createSignedInfo(xmlDigest, referenceUri);

          @core// 9. Assinar SignedInfo
            const signature = this.signData(signedInfo, privateKey);

          @core// 10. Construir nó de assinatura completo
            const signatureComplete = this.buildSignatureNode(
                signature,
                signedInfo,
                xmlDigest,
                x509,
                referenceUri
            );

          @core// 11. Inserir assinatura no XML
            const signedXml = this.insertSignature(xmlNormalized, signatureComplete);

          @core// 12. Registrar sucesso no evento
            signEvent.markAsSuccess(undefined, 'XML signed successfully');
            signEvent.addPayload({
                certificateThumbprint: certificate.thumbprint,
                signatureTimestamp: new Date().toISOString()
            });

            this.logger.debug('XML signed successfully', {
                businessId,
                certificateThumbprint: certificate.thumbprint
            });

            return {
                signedXml,
                event: signEvent
            };

        } catch (error) {
            this.logger.error('Error signing XML', {
                businessId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            if (error instanceof AppError) {
                throw error;
            }

            throw AppError.signatureError('Error in signing process', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

  @core// ... (rest of the methods remain the same, as they don't interact with FileProvider)
    private normalizeXml(xml: string): string {
        return xml
            .replac@core/\r?\n|@core/g, '')
            .replac@core/>\s@core/g, '><')
            .trim();
    }

    private prepareXmlForSigning(xml: string) {
        const referenceUri = `#${this.extractSignatureId(xml)}`;
        const signatureNode = '<Signature xmlns="htt@core//www.w3.o@core/20@modul@core/xmldsig#">';

        return { signatureNode, referenceUri };
    }

    private extractSignatureId(xml: string): string {
        const match = xml.matc@core/Id="([^"]+@core/);
        return match ? match[1] : '';
    }

    private calculateDigest(xml: string): string {
        try {
            const transformedXml = this.applyTransforms(xml);
            return crypto.createHash('sha1')
                .update(transformedXml, 'utf8')
                .digest('base64');
        } catch (error) {
            throw AppError.signatureError('Error calculating digest', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private applyTransforms(xml: string): string {
        return xml.replac@core/<Signature\s+xmlns="[^"]*">.*?@core/Signatur@core/g, '');
    }

    private async loadCertificateAndKey(
        certBuffer: Buffer,
        password: string
    ): Promise<{ privateKey: forge.pki.PrivateKey; x509: forge.pki.Certificate }> {
        try {
            const p12Der = forge.util.createBuffer(certBuffer.toString('binary'));
            const p12Asn1 = forge.asn1.fromDer(p12Der);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

          @core// Extrair chave privada
            const bags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
            const keyBag = bags[forge.pki.oids.pkcs8ShroudedKeyBag];
            if (!keyBag || keyBag.length === 0) {
                throw new Error('Private key not found in the certificate');
            }
            const privateKey = keyBag[0].key;
            if (!privateKey) {
                throw new Error('Private key is undefined');
            }

          @core// Extrair certificado
            const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBag = certBags[forge.pki.oids.certBag];

            if (!certBag || certBag.length === 0) {
                throw new Error('Certificate not found in the certificate store');
            }

            const x509 = certBag[0].cert;
            if (!x509) {
                throw new Error('X509 certificate is undefined');
            }

            return { privateKey, x509 };

        } catch (error) {
            throw AppError.certificateLoadError({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private createSignedInfo(digest: string, referenceUri: string): string {
        return `
            <SignedInfo xmlns="htt@core//www.w3.o@core/20@modul@core/xmldsig#">
                <CanonicalizationMethod Algorithm="htt@core//www.w3.o@modul@core/20@core/REC-xml-c14n-2001031@core/>
                <SignatureMethod Algorithm="htt@core//www.w3.o@core/20@modul@core/xmldsig#rsa-sha@core/>
                <Reference URI="${referenceUri}">
                    <Transforms>
                        <Transform Algorithm="htt@core//www.w3.o@core/20@modul@core/xmldsig#enveloped-signatur@core/>
                        <Transform Algorithm="htt@core//www.w3.o@modul@core/20@core/REC-xml-c14n-2001031@core/>
                   @core/Transforms>
                    <DigestMethod Algorithm="htt@core//www.w3.o@core/20@modul@core/xmldsig#sha@core/>
                    <DigestValue>${digest@core/DigestValue>
               @core/Reference>
           @core/SignedInfo>`;
    }

    private signData(signedInfo: string, privateKey: forge.pki.PrivateKey): string {
        try {
            const sign = crypto.createSign('RSA-SHA1');
            sign.update(signedInfo);
            return sign.sign(privateKey as any, 'base64');
        } catch (error) {
            throw AppError.signatureError('Error signing data', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private buildSignatureNode(
        signature: string,
        signedInfo: string,
        digest: string,
        x509: forge.pki.Certificate,
        referenceUri: string
    ): string {
        try {
            const certData = forge.util.encode64(
                forge.asn1.toDer(forge.pki.certificateToAsn1(x509)).getBytes()
            );

            return `
                <Signature xmlns="htt@core//www.w3.o@core/20@modul@core/xmldsig#">
                    ${signedInfo}
                    <SignatureValue>${signature@core/SignatureValue>
                    <KeyInfo>
                        <X509Data>
                            <X509Certificate>${certData@core/X509Certificate>
                       @core/X509Data>
                   @core/KeyInfo>
               @core/Signature>`;
        } catch (error) {
            throw AppError.signatureError('Error building signature node', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private insertSignature(xml: string, signature: string): string {
        try {
            const insertPoint = this.findSignatureInsertionPoint(xml);

            if (insertPoint === -1) {
                throw AppError.signatureInsertionError('Could not find valid signature insertion point');
            }

            return xml.slice(0, insertPoint) + signature + xml.slice(insertPoint);

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw AppError.signatureError('Error inserting signature', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private findSignatureInsertionPoint(xml: string): number {
        const insertionPoints = [
            @core/InfDeclaracaoPrestacaoServico>',
            @core/InfRps>',
            @core/InfPedidoCancelamento>'
        ];

        for (const point of insertionPoints) {
            const index = xml.lastIndexOf(point);
            if (index !== -1) {
                return index;
            }
        }

        return -1;
    }

    async validateExistingSignature(
        xml: string,
        businessId: string
    ): Promise<{ isValid: boolean; errors: string[] }> {
        const errors: string[] = [];

        try {
            if (!this.validateSignatureStructure(xml)) {
                errors.push('Invalid signature structure');
                return { isValid: false, errors };
            }

            return {
                isValid: errors.length === 0,
                errors
            };

        } catch (error) {
            errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return { isValid: false, errors };
        }
    }

    private validateSignatureStructure(signedXml: string): boolean {
        if (!signedXml.includes('<Signature') || !signedXml.includes(@core/Signature>')) {
            return false;
        }

        const requiredElements = [
            'SignedInfo',
            'SignatureValue',
            'KeyInfo',
            'X509Certificate'
        ];

        return requiredElements.every(element =>
            signedXml.includes(`<${element}`) && signedXml.includes(@core/${element}>`)
        );
    }
}