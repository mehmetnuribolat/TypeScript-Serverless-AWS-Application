import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = (): DynamoDBClient => 
{
    //You can add other configurations
    return new DynamoDBClient({
        apiVersion: '2010-12-01',
        region: 'eu-west-1'
    });
};
export default dynamoDBClient;