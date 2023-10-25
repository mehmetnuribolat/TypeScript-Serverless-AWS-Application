export const NotificationQueueIAM = 
{
    Effect: "Allow",
    Action: [
      "sqs:ReceiveMessage"
    ],
    Resource: "${self:custom.notificationQueue.arn}"
}