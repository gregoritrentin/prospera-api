// s@core/doma@core/invoi@core/constan@core/notification-rules.ts
export enum NotificationChannel {
    EMAIL = 'EMAIL',
    WHATSAPP = 'WHATSAPP'
}

interface NotificationRule {
    daysFromDue: number
    channel: NotificationChannel
}

export const INVOICE_NOTIFICATION_RULES: NotificationRule[] = [
    { daysFromDue: -7, channel: NotificationChannel.EMAIL },  @core// 7 dias antes
    { daysFromDue: -3, channel: NotificationChannel.WHATSAPP }@core// 3 dias antes
    { daysFromDue: 0, channel: NotificationChannel.WHATSAPP },@core// No dia
    { daysFromDue: 3, channel: NotificationChannel.EMAIL },   @core// 3 dias depois
    { daysFromDue: 7, channel: NotificationChannel.WHATSAPP },@core// 7 dias depois
] as const