// src/infra/queues/consumers/invoice-notifications-queue.consumer.ts

import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { I18nService } from '@/i18n';
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository';
import { NotificationChannel, INVOICE_NOTIFICATION_RULES } from '@/domain/invoice/constants/notification-rules';
import { readFile } from 'fs/promises';
import { compile } from 'handlebars';
import { join } from 'path';
import { PersonsRepository } from '@/domain/person/repositories/persons-repository';
import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { EmailProvider } from '@/domain/providers/email-provider';
import { WhatsAppProvider } from '@/domain/providers/whatsapp-provider';

@Processor('invoice-notifications')
export class InvoiceNotificationsQueueConsumer {
    private readonly logger = new Logger(InvoiceNotificationsQueueConsumer.name);

    constructor(
        private invoiceRepository: InvoiceRepository,
        private personsRepository: PersonsRepository,
        private businessRepository: BusinessRepository,
        private readonly emailProvider: EmailProvider,
        private readonly whatsAppProvider: WhatsAppProvider,
        private i18nService: I18nService,
    ) { }

    @Process('process')
    async handleProcessNotifications(job: Job) {
        this.logger.log(`Processing invoice notifications job: ${job.id}`);
        const startTime = Date.now();
        const { date } = job.data;

        try {
            // Contadores para o relatório
            let processedCount = 0;
            let emailsSent = 0;
            let whatsappsSent = 0;

            // Carrega os templates
            const emailTemplate = await this.loadTemplate('email/due-notification.html');
            const whatsappTemplate = await this.loadTemplate('whatsapp/due-notification.txt');

            // Para cada regra de notificação
            for (const rule of INVOICE_NOTIFICATION_RULES) {
                // Calcula a data de vencimento alvo baseado na regra
                const targetDueDate = new Date(date);
                targetDueDate.setDate(targetDueDate.getDate() + rule.daysFromDue);

                // Busca faturas que vencem na data alvo e estejam pendentes
                const invoices = await this.invoiceRepository.findByDueDate(targetDueDate, 'PENDING');

                // Processa cada fatura
                for (const invoice of invoices) {
                    try {
                        // Busca informações complementares
                        const person = await this.personsRepository.findById(invoice.personId.toString(), invoice.businessId.toString());
                        const business = await this.businessRepository.findById(invoice.businessId.toString());

                        if (!person || !business) {
                            this.logger.error(
                                `Missing data for invoice ${invoice.id}: person or business not found`,
                                { personId: invoice.personId, businessId: invoice.businessId }
                            );
                            continue;
                        }

                        const templateData = {
                            invoice: {
                                id: invoice.id.toString(),
                                amount: invoice.amount,
                                dueDate: invoice.dueDate,
                                description: invoice.description,
                                paymentLink: invoice.paymentLink,
                                status: invoice.status
                            },
                            person: {
                                name: person.name,
                                email: person.email,
                                phone: person.phone
                            },
                            business: {
                                name: business.name
                            },
                            isOverdue: rule.daysFromDue > 0,
                            daysText: this.formatDaysText(rule.daysFromDue),
                            formatCurrency: (value: number) =>
                                value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
                            formatDate: (date: Date) =>
                                date.toLocaleDateString('pt-BR'),
                        };

                        // Envia notificação baseado no canal definido na regra
                        if (rule.channel === NotificationChannel.EMAIL && person.email) {
                            const html = emailTemplate(templateData);

                            await this.emailProvider.send({
                                to: person.email,
                                subject: this.getEmailSubject(rule.daysFromDue),
                                body: html,
                            });

                            emailsSent++;
                        }

                        if (rule.channel === NotificationChannel.WHATSAPP && person.phone) {
                            const message = whatsappTemplate(templateData);

                            await this.whatsAppProvider.send({
                                to: person.phone,
                                content: message,
                            });

                            whatsappsSent++;
                        }

                        processedCount++;
                    } catch (error) {
                        this.logger.error(
                            `Error processing invoice ${invoice.id} for business ${invoice.businessId}:`,
                            error
                        );
                    }
                }
            }

            const duration = Date.now() - startTime;
            this.logger.log(
                `Invoice notifications job completed: ${job.id}
               - Duration: ${duration}ms
               - Processed: ${processedCount}
               - Emails: ${emailsSent}
               - WhatsApp: ${whatsappsSent}`
            );

            return {
                processedCount,
                emailsSent,
                whatsappsSent
            };

        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(
                `Error processing invoice notifications job: ${job.id}
               - Duration: ${duration}ms
               - Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
            throw error;
        }
    }

    private async loadTemplate(path: string) {
        const templatePath = join(
            process.cwd(),
            'src/infra/templates/invoice',
            path
        );
        const templateContent = await readFile(templatePath, 'utf-8');
        return compile(templateContent);
    }

    private getEmailSubject(daysFromDue: number): string {
        if (daysFromDue > 0) {
            return `Sua fatura está vencida há ${this.formatDaysText(daysFromDue)}`;
        }
        if (daysFromDue < 0) {
            return `Sua fatura vence em ${this.formatDaysText(daysFromDue)}`;
        }
        return 'Sua fatura vence hoje';
    }

    private formatDaysText(days: number): string {
        const absDays = Math.abs(days);
        if (absDays === 0) return 'hoje';
        if (absDays === 1) return '1 dia';
        return `${absDays} dias`;
    }
}