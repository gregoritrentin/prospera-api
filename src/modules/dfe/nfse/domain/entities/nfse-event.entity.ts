import { Entity } from '@/core/domain/entity/entity'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Optional } from '@/core/utils/optional'
import { NfseEventType, NfseEventStatus } from '@/core/utils/enums'

export interface NfseEventProps {
    nfseId: UniqueEntityID
    type: NfseEventType
    status: NfseEventStatus
    message?: string | null

    // XML tracking
    requestXml?: string | null
    responseXml?: string | null
    returnMessage?: string | null

    // Additional data
    payload?: Record<string, any> | null

    // Timestamps
    createdAt: Date
    updatedAt?: Date | null
}

export class NfseEvent extends Entity<NfseEventProps> {
    // Basic getters
    get nfseId() {
        return this.props.nfseId
    }

    get type() {
        return this.props.type
    }

    get status() {
        return this.props.status
    }

    get message() {
        return this.props.message
    }

    get requestXml() {
        return this.props.requestXml
    }

    get responseXml() {
        return this.props.responseXml
    }

    get returnMessage() {
        return this.props.returnMessage
    }

    get payload() {
        return this.props.payload
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    // Setters with touch
    set status(status: NfseEventStatus) {
        this.props.status = status
        this.touch()
    }

    set message(message: string | null | undefined) {
        this.props.message = message
        this.touch()
    }

    // Adicionando o setter para requestXml
    set requestXml(requestXml: string | null | undefined) {
        this.props.requestXml = requestXml
        this.touch()
    }

    set responseXml(responseXml: string | null | undefined) {
        this.props.responseXml = responseXml
        this.touch()
    }

    set returnMessage(returnMessage: string | null | undefined) {
        this.props.returnMessage = returnMessage
        this.touch()
    }

    set payload(payload: Record<string, any> | null | undefined) {
        this.props.payload = payload
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    // Helper methods
    markAsSuccess(responseXml?: string, returnMessage?: string) {
        this.status = NfseEventStatus.SUCCESS
        this.responseXml = responseXml
        this.returnMessage = returnMessage
        this.touch()
    }

    markAsError(message: string, responseXml?: string) {
        this.status = NfseEventStatus.ERROR
        this.message = message
        this.responseXml = responseXml
        this.touch()
    }

    markAsTimeout() {
        this.status = NfseEventStatus.TIMEOUT
        this.message = 'Operation timed out'
        this.touch()
    }

    addPayload(payload: Record<string, any>) {
        this.payload = {
            ...this.props.payload,
            ...payload,
        }
        this.touch()
    }

    static create(
        props: Optional<
            NfseEventProps,
            | 'createdAt'
            | 'message'
            | 'requestXml'
            | 'responseXml'
            | 'returnMessage'
            | 'payload'
            | 'updatedAt'
        >,
        id?: UniqueEntityID,
    ) {
        const nfseEvent = new NfseEvent(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                message: props.message ?? null,
                requestXml: props.requestXml ?? null,
                responseXml: props.responseXml ?? null,
                returnMessage: props.returnMessage ?? null,
                payload: props.payload ?? null,
            },
            id,
        )

        return nfseEvent
    }
}