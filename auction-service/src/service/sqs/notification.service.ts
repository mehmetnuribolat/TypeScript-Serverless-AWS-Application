import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export default class NotificationService 
{
    constructor(private sqsClient: SQSClient){}

    async sendNotification(subject: string, body: string, recipient: string)
    {
        const messageCommand = new SendMessageCommand(
        { 
            QueueUrl: process.env.NOTIFICATION_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject,
                recipient,
                body
            })
        });

        const result = this.sqsClient.send(messageCommand);
        return result;
    }

}