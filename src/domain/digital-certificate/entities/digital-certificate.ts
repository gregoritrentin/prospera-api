import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum CertificateSource {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL'
}

export enum CertificateStatus {
    PENDING_VALIDATION = 'PENDING_VALIDATION',
    ACTIVE = 'ACTIVE',
    EXPIRING = 'EXPIRING',
    EXPIRED = 'EXPIRED',
    INVALID = 'INVALID'
}

export interface DigitalCertificateProps {
    businessId: UniqueEntityID
    certificateFileId: UniqueEntityID
    source: CertificateSource

    // Certificate Info
    serialNumber: string
    thumbprint: string
    password: string

    // Dates
    issueDate: Date
    expirationDate: Date
    installationDate?: Date | null

    // Status
    status: CertificateStatus

    // Timestamps
    createdAt: Date
    updatedAt?: Date | null
}

export class DigitalCertificate extends AggregateRoot<DigitalCertificateProps> {
    get businessId() {
        return this.props.businessId
    }

    get certificateFileId() {
        return this.props.certificateFileId
    }

    get source() {
        return this.props.source
    }

    get serialNumber() {
        return this.props.serialNumber
    }

    get thumbprint() {
        return this.props.thumbprint
    }

    get password() {
        return this.props.password
    }

    get issueDate() {
        return this.props.issueDate
    }

    get expirationDate() {
        return this.props.expirationDate
    }

    get installationDate() {
        return this.props.installationDate
    }

    get status() {
        return this.props.status
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    // Setters with touch
    set password(password: string) {
        this.props.password = password
        this.touch()
    }

    set installationDate(date: Date | null | undefined) {
        this.props.installationDate = date
        this.touch()
    }

    set status(status: CertificateStatus) {
        this.props.status = status
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    // Helper methods
    isExpired(): boolean {
        return new Date() > this.expirationDate
    }

    isActive(): boolean {
        return this.status === CertificateStatus.ACTIVE
    }

    isExpiring(daysThreshold: number = 30): boolean {
        if (this.isExpired()) return false

        const daysToExpiration = Math.floor(
            (this.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )

        return daysToExpiration <= daysThreshold
    }

    markAsInstalled() {
        this.installationDate = new Date()
        this.status = CertificateStatus.ACTIVE
    }

    checkAndUpdateStatus() {
        if (this.isExpired()) {
            this.status = CertificateStatus.EXPIRED
        } else if (this.isExpiring()) {
            this.status = CertificateStatus.EXPIRING
        }
    }

    static create(
        props: Optional<
            DigitalCertificateProps,
            'createdAt' | 'installationDate' | 'updatedAt'
        >,
        id?: UniqueEntityID
    ) {
        const certificate = new DigitalCertificate({
            ...props,
            createdAt: props.createdAt ?? new Date(),
            installationDate: props.installationDate ?? null,
            updatedAt: props.updatedAt ?? null
        }, id)

        certificate.checkAndUpdateStatus()

        return certificate
    }
}