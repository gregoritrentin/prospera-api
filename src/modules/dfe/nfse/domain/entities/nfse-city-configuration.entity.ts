import { Entity } from '@/core/domain/entity/entity'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Optional } from '@/core/utils/optional'
import { AbrasfVersion } from '@/core/utils/enums'

export interface NfseCityConfigurationProps {
    name: string
    cityCode: string
    stateCode: string
    provider: string
    abrasfVersion: AbrasfVersion
    sandboxUrl?: string
    productionUrl: string
    timeout?: number // Adicionado
    createdAt: Date
    updatedAt?: Date | null
}

export class NfseCityConfiguration extends Entity<NfseCityConfigurationProps> {
    // Basic getters
    get name() {
        return this.props.name
    }

    get cityCode() {
        return this.props.cityCode
    }

    get stateCode() {
        return this.props.stateCode
    }

    get provider() {
        return this.props.provider
    }

    get abrasfVersion() {
        return this.props.abrasfVersion
    }

    get sandboxUrl(): string | undefined {
        return this.props.sandboxUrl
    }

    get productionUrl() {
        return this.props.productionUrl
    }

    get timeout() {
        return this.props.timeout ?? 5000 // Valor padrão
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    // Setters with touch
    set name(name: string) {
        this.props.name = name
        this.touch()
    }

    set cityCode(cityCode: string) {
        this.props.cityCode = cityCode
        this.touch()
    }

    set stateCode(stateCode: string) {
        this.props.stateCode = stateCode
        this.touch()
    }

    set provider(provider: string) {
        this.props.provider = provider
        this.touch()
    }

    set abrasfVersion(abrasfVersion: AbrasfVersion) {
        this.props.abrasfVersion = abrasfVersion
        this.touch()
    }

    set sandboxUrl(sandboxUrl: string) {
        this.props.sandboxUrl = sandboxUrl
        this.touch()
    }

    set productionUrl(productionUrl: string) {
        this.props.productionUrl = productionUrl
        this.touch()
    }

    set timeout(timeout: number) {
        this.props.timeout = timeout
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(
        props: Optional<NfseCityConfigurationProps, 'createdAt' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const nfseCityConfiguration = new NfseCityConfiguration(
            {
                ...props,
                timeout: props.timeout ?? 5000, // Definir valor padrão ao criar
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return nfseCityConfiguration
    }

    // Helper methods
    getEndpoint(environment: 'production' | 'sandbox'): string {
        if (environment === 'sandbox' && !this.sandboxUrl) {
            throw new Error('Sandbox URL is not configured')
        }
        return environment === 'production' ? this.productionUrl : this.sandboxUrl!
    }
}