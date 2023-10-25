# TypeScript-Serverless-AWS-Application
Sample Car Auction Serverless Application using TypeScript, Serverless Framework and AWS.

## 💻 Tech Stack
- Environment: [Node.js](https://nodejs.org/)
- Framework: [Serverless](https://www.serverless.com/)
- Language: [TypeScript](https://www.typescriptlang.org/)
- NoSQL Database: [DynamoDB](https://aws.amazon.com/dynamodb/)
- Serverless Compute Service: [AWS Lambda](https://aws.amazon.com/pm/lambda/)
- API-Gateway: [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
- Identity-Access Management: [Amazon Cognito](https://aws.amazon.com/cognito/)
- Event Bus: [Amazon EventBridge](https://aws.amazon.com/eventbridge/)
- Email Service: [Amazon SES](https://aws.amazon.com/ses/)
- Object Storage: [Amazon S3](https://aws.amazon.com/s3/)
- Message Queuing: [Amazon SQS](https://aws.amazon.com/sqs/)
- Real-Time Log Monitoring: [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/)

## ⌨️ Development

First, you need to create [AWS Account.](https://aws.amazon.com/free/). Then you have to get Access Key and Secret.

### Install AWS CLI:
You can follow instructions in the [official document.](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Install Serverless Package Globally

```
npm install -g serverless
```

### Setup AWS Credentials:

```
aws configure
```

### Install Packages for each Service:

```
cd auction-service
npm install
```
```
cd authentication-service
npm install
```
```
cd notification-service
npm install
```

### Deploy services to AWS:

```
cd auction-service
serverless deploy
```
```
cd authentication-service
serverless deploy
```
```
cd notification-service
serverless deploy
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mehmetnuribolat/TypeScript-Serverless-AWS-Application/issues).

## :pray: Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is under [MIT](https://github.com/mehmetnuribolat/TypeScript-Serverless-AWS-Application/blob/main/LICENSE) license.

