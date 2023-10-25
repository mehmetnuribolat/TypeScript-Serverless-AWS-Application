export const NotificationQueueIAM = 
{
    Effect: "Allow",
    Action: [
      "sqs:SendMessage"
    ],
    Resource: "${self:custom.NotificationQueue.arn}"
}