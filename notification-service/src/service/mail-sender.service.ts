import Mail from '../model/mail.model';
import { SESClient, SendEmailCommand, SendEmailCommandOutput } from "@aws-sdk/client-ses";

export default class MailSenderService {
    constructor(private sesClient: SESClient ){}

    async sendMail(mail: Mail): Promise<SendEmailCommandOutput> 
    { 
        console.log("Mail to Send : > " + mail);
        const params = new SendEmailCommand({
            Source: "developer.mnb@gmail.com",
            Destination: {
                ToAddresses: [mail.recipient]
            },
            Message: {
                Body:{
                    Text: {
                        Data: mail.body
                    }
                },
                Subject: {
                    Data: mail.subject
                }
            }
        });

        const result = await this.sesClient.send(params);
        return result;
    }
}