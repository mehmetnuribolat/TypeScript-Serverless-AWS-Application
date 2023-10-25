import {SQSClient} from "@aws-sdk/client-sqs";

const sqsClient = (): SQSClient => 
{
    //You can add other configurations
    return new SQSClient({
        apiVersion: '2010-12-01',
        region: 'eu-west-1'
    });
};
export default sqsClient;