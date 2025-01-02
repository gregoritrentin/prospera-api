import { Entity } from @core/co@core/entiti@core/entity';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { Optional } from @core/co@core/typ@core/optional';

export interface WhatsAppProps {
    businessId: UniqueEntityID;
    to: string;
    content: string;
    status: string;
    mediaType?: string;
    mediaUrl?: string;
    createdAt: Date;
}

export class WhatsApp extends Entity<WhatsAppProps> {
    get businessId() {
        return this.props.businessId;
    }

    get to() {
        return this.props.to;
    }

    get content() {
        return this.props.content;
    }

    get status() {
        return this.props.status;
    }

    get mediaType() {
        return this.props.mediaType;
    }

    get mediaUrl() {
        return this.props.mediaUrl;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    static create(
        props: Optional<WhatsAppProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        const whatsapp = new WhatsApp(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );
        return whatsapp;
    }
}