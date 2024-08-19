// import { Email } from "@/domain/email/entities/email";
// import { Processor, WorkerHost } from "@nestjs/bullmq";
// import { Job } from "bullmq";
// import { SendGridRepository } from "../email/sendgrid-repository";


// @Processor('sendMail-queue')
// export class SendMailConsumer  {

//     constructor(private sendGridRepository: SendGridRepository) { }

//     @Process('sendMail-job')

//     async sendMailJob(job: Job<Email>) {

//         const { data } = job;

//         await this.sendGridRepository.send({
//             to: data.to,
//             subject: data.subject,
//             html: data.html,
//             text: data.text
//         })

//     }
// }




// import { Email } from "@/domain/email/entities/email";
// import { Processor, WorkerHost } from "@nestjs/bullmq";
// import { Job } from "bullmq";
// import { SendGridRepository } from "../email/sendgrid-repository";

// @Processor('sendMail-queue')
// export class SendMailConsumer extends WorkerHost {

//     constructor(private sendGridRepository: SendGridRepository) {
//         super();
//     }

//     async process(job: Job<Email>): Promise<any> {
//         const { data } = job;

//         await this.sendGridRepository.send({
//             to: data.to,
//             subject: data.subject,
//             html: data.html,
//             text: data.text
//         });

//         return {};
//     }
// }
