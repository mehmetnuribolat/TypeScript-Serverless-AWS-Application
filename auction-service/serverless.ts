import type { AWS } from '@serverless/typescript';

import { closeCarAuctions, createBid, createCarAuction, getCarAuction, getCarAuctions, uploadAuctionImage } from '@functions/auction';
import { CarAuctionsBucketIAM, CarAuctionsTableIAM, NotificationQueueIAM } from './iam';

const serverlessConfiguration: AWS = {
  service: 'auction-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    memorySize: 256,
    region: 'eu-west-1',
    stage: "${opt:stage, 'dev'}",
    environment: {
      CAR_AUCTIONS_TABLE_NAME: '${self:custom.CarAuctionsTable.name}',
      NOTIFICATION_QUEUE_URL: '${self:custom.NotificationQueue.url}',
      CAR_AUCTIONS_BUCKET_NAME: '${self:custom.CarAuctionsBucket.name}'
    },
    iam: {
      role: {
        statements: [CarAuctionsBucketIAM, CarAuctionsTableIAM, NotificationQueueIAM]
      }
    }
  },
  package: { individually: true },
  functions: { createCarAuction, getCarAuction, getCarAuctions, createBid, uploadAuctionImage, closeCarAuctions},
  resources: {
    Resources: {
      CarAuctionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
            TableName: "CarAuctionsTable-${self:provider.stage}",
            BillingMode: "PAY_PER_REQUEST",
            AttributeDefinitions: [
                {
                    AttributeName: "id",
                    AttributeType: "S"
                },
                {
                    AttributeName: "status",
                    AttributeType: "S"
                },
                {
                    AttributeName: "bid_ending_at",
                    AttributeType: "S"
                }
            ],
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH"
                }
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: "statusAndEndDate",
                    KeySchema: [
                        {
                            AttributeName: "status",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "bid_ending_at",
                            KeyType: "RANGE"
                        }
                    ],
                    Projection: {
                        ProjectionType: "ALL"
                    }
                }
            ]
        }
    },
      CarAuctionsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
            BucketName: "${self:custom.CarAuctionsBucket.name}",
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false
            },
            OwnershipControls: {
                Rules: [
                    {
                        ObjectOwnership: "ObjectWriter"
                    }
                ]
            },
            LifecycleConfiguration: {
                Rules: [
                    {
                        Id: "ExpirePictures",
                        Status: "Enabled",
                        ExpirationInDays: 1
                    }
                ]
            }
        }
      },
      CarAuctionsBucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
            Bucket: { 'Ref': 'CarAuctionsBucket'},
            PolicyDocument: {
                Statement: [
                    {
                        Sid: "PublicRead",
                        Effect: "Allow",
                        Principal: "*",
                        Action: [
                            "s3:GetObject"
                        ],
                        Resource: "arn:aws:s3:::${self:custom.CarAuctionsBucket.name}/*"
                    }
                ]
            }
        }
      }
    },
  },
  custom: {
    authorizer: "arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:auth-service-${self:provider.stage}-auth",
    CarAuctionsTable: {
      name: { 'Ref': 'CarAuctionsTable'},
      arn : { 'Fn::GetAtt': ['CarAuctionsTable', 'Arn'] }
    },
    NotificationQueue: {
      arn: "${cf:car-auction-notification-service-${self:provider.stage}.NotificationQueueArn}",
      url : "${cf:car-auction-notification-service-${self:provider.stage}.NotificationQueueUrl}"
    },
    CarAuctionsBucket: {
      name: "car-auctions-bucket-sj19asxmmnb-${self:provider.stage}",
    },
    bundle: {
      linting: false
    }

  },
};

module.exports = serverlessConfiguration;
