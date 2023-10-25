import { handlerPath } from "@libs/handler-resolver";

//Definition of Lambda Functions
export const sendNotification = {
    handler: `${handlerPath(__dirname)}/handler.sendNotification`,
    events: [
        {
            sqs: {
                arn: "${self:custom.notificationQueue.arn}",
                batchSize: 1,
            },
        },
    ],
};
