
// import { InjectQueue } from "@nestjs/bullmq";
// import { Injectable } from "@nestjs/common";
// import { Queue } from "bullmq";
// import { Email } from "@/domain/email/entities/email";


// @Injectable()
// export class SendMailProducerService {
//     constructor(@InjectQueue('sendMail-queue') private queue: Queue) { }

//     async sendMail(email: Email) {
//         await this.queue.add('sendMail-job', email);
//     }

// }


