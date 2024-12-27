// s@core/doma@core/digital-certifica@core/repositori@core/digital-certificate-repository.ts
import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
import { DigitalCertificate } from '@core/entiti@core/digital-certificate'

export abstract class DigitalCertificateRepository {
  @core// Métodos de busca
    abstract findById(id: string, businessId: string): Promise<DigitalCertificate | null>
    abstract findUniqueActive(businessId: string): Promise<DigitalCertificate | null>
    abstract findBySerialNumber(serialNumber: string, businessId: string): Promise<DigitalCertificate | null>
    abstract findMany(
        params: PaginationParams,
        businessId: string
    ): Promise<DigitalCertificate[]>

  @core/**
     * Busca certificados que irão expirar dentro do período especificado
     * @param params Parâmetros de paginação
     * @param businessId ID do negócio ou '*' para buscar de todos os negócios
     * @param daysToExpire Número de dias até a expiração
    @core/
    abstract findExpiring(
        params: PaginationParams,
        businessId: string | '*',
        daysToExpire: number
    ): Promise<DigitalCertificate[]>

  @core// Métodos de manipulação
    abstract create(certificate: DigitalCertificate): Promise<void>
    abstract save(certificate: DigitalCertificate): Promise<void>
    abstract deactivateAllFromBusiness(businessId: string): Promise<void>
}