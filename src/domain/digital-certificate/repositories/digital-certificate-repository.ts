import { PaginationParams } from '@/core/repositories/pagination-params'
import { DigitalCertificate } from '../entities/digital-certificate'

export abstract class DigitalCertificateRepository {
    // Métodos de busca
    abstract findById(id: string, businessId: string): Promise<DigitalCertificate | null>
    abstract findUniqueActive(businessId: string): Promise<DigitalCertificate | null>
    abstract findMany(
        params: PaginationParams,
        businessId: string
    ): Promise<DigitalCertificate[]>

    /**
     * Busca certificados que irão expirar dentro do período especificado
     * @param params Parâmetros de paginação
     * @param businessId ID do negócio ou '*' para buscar de todos os negócios
     * @param daysToExpire Número de dias até a expiração
     */
    abstract findExpiring(
        params: PaginationParams,
        businessId: string | '*',
        daysToExpire: number
    ): Promise<DigitalCertificate[]>

    // Métodos de manipulação
    abstract create(certificate: DigitalCertificate): Promise<void>

    abstract save(certificate: DigitalCertificate): Promise<void>
    abstract deactivateAllFromBusiness(businessId: string): Promise<void>
}