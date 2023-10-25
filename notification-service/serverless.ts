import type { AWS } from '@serverless/typescript';
import { sendNotification } from '@functions/notification';
import { SendMailIAM } from './iam/send-mail.iam';
import { NotificationQueueIAM } from 'iam/notification-queue.iam';

const serverlessConfiguration: AWS = {
  service: 'car-auction-notification-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    memorySize: 256,
    region: 'eu-west-1',
    stage: "${opt:stage, 'dev'}",
    iam: {
      role: {
        statements: [SendMailIAM, NotificationQueueIAM]
      }
    }
  },
  resources: {
    Resources: {
      NotificationQueue: {
        Type : "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:custom.notificationQueue.name}"
        },
      },
    },
    Outputs: {
      NotificationQueueArn: {
        Value: "${self:custom.notificationQueue.arn}",
        Export: {
          Name: "${self:custom.notificationQueue.name}-Arn"
        }
      },
      NotificationQueueUrl: {
        Value: "${self:custom.notificationQueue.arn}",
        Export: {
          Name: "${self:custom.notificationQueue.name}-Url"
        }
      }
    }
  },
  functions: { sendNotification },
  custom: {
    notificationQueue: {
      name: "NotificationQueue-${self:provider.stage}",
      arn: { 'Fn::GetAtt': ['NotificationQueue', 'Arn'] },
      url: { 'Fn::Ref': 'NotificationQueue'},
    },
  },
};

module.exports = serverlessConfiguration;
