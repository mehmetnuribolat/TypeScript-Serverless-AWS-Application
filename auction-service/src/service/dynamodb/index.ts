import AuctionService from "./auction-service.service";
import dynamoDbClient from "./dynamodb-client.service";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const auctionService = new AuctionService(DynamoDBDocumentClient.from(dynamoDbClient()));

export default auctionService;