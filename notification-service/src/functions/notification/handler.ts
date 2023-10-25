import  commonMiddleware  from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import Mail from "../../model/mail.model";
import mailSenderService from "../../service";

export const sendNotification = commonMiddleware(async (event: SQSEvent): Promise<void> => {
    try 
    {
        const sqsEventRecord: any = event.Records[0];
        console.log('Notification - Start to Process', sqsEventRecord);
    
        const email: Mail = sqsEventRecord.body;
        
        const result = await mailSenderService.sendMail(email);
        console.log(result);

    }catch(err) 
    {
        console.error(err);
    }
});