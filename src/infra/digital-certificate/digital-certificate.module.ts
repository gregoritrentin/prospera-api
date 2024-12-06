import { Module } from '@nestjs/common'
import { DigitalCertificateProvider } from "@/domain/interfaces/digital-certificate-provider";
import { DigitalCertificateReaderService } from "./services/certificate-reader.service";
import { CreateDigitalCertificateUseCase } from "@/domain/digital-certificate/use-cases/create-digital-certificate";

@Module({
    providers: [
        {
            provide: DigitalCertificateProvider,
            useClass: DigitalCertificateReaderService
        },
        CreateDigitalCertificateUseCase,
        // ... outros providers
    ],
    exports: [DigitalCertificateProvider]
})
export class DigitalCertificateModule { }