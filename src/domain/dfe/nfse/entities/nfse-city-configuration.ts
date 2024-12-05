// src/domain/dfe/nfse/entities/nfse-city-configuration.ts
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AbrasfVersion } from '@/core/types/enums'

export interface NfseCityConfigurationProps {
    name: string
    cityCode: string
    stateCode: string
    abrasfVersion: AbrasfVersion
    sandboxUrl: string
    productionUrl: string
    queryUrl?: string | null
    timeout: number
    specificFields?: Record<string, any> | null
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

    get abrasfVersion() {
        return this.props.abrasfVersion
    }

    get sandboxUrl() {
        return this.props.sandboxUrl
    }

    get productionUrl() {
        return this.props.productionUrl
    }

    get queryUrl() {
        return this.props.queryUrl
    }

    get timeout() {
        return this.props.timeout
    }

    get specificFields() {
        return this.props.specificFields
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

    set queryUrl(queryUrl: string | null | undefined) {
        this.props.queryUrl = queryUrl
        this.touch()
    }

    set timeout(timeout: number) {
        this.props.timeout = timeout
        this.touch()
    }

    set specificFields(specificFields: Record<string, any> | null | undefined) {
        this.props.specificFields = specificFields
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    static create(
        props: Optional<NfseCityConfigurationProps, 'createdAt' | 'updatedAt' | 'queryUrl' | 'specificFields'>,
        id?: UniqueEntityID,
    ) {
        const nfseCityConfiguration = new NfseCityConfiguration(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                queryUrl: props.queryUrl ?? null,
                specificFields: props.specificFields ?? null,
            },
            id,
        )

        return nfseCityConfiguration
    }

    // Helper methods
    getEndpoint(environment: 'production' | 'sandbox'): string {
        return environment === 'production' ? this.productionUrl : this.sandboxUrl
    }

    hasSpecificField(fieldName: string): boolean {
        return this.specificFields !== null && this.specificFields !== undefined && fieldName in this.specificFields
    }

    getSpecificField<T>(fieldName: string, defaultValue: T): T {
        if (!this.specificFields || !(fieldName in this.specificFields)) {
            return defaultValue
        }
        return this.specificFields[fieldName] as T
    }
}