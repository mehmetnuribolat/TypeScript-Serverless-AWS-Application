import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommandInput, UpdateCommand, UpdateCommandInput, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import AuctionBidCreationDto from "../../model/dtos/auction-bid.dto";
import CarAuction from "../../model/db/car-auction.model";
import { QueryCommand } from "@aws-sdk/client-dynamodb";

export default class AuctionService {
    constructor(private dynamoDbClient: DynamoDBDocumentClient){}

    async createAuction(record: CarAuction) : Promise<any> 
    {
        const result = await this.dynamoDbClient.send(new PutCommand({
          TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
          Item: record,
        }));

        return result;
    }

    async getAuctionById(id: string) : Promise<any>
    {
        let result = await this.dynamoDbClient.send(new GetCommand(
          {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            Key: {id: id}
          }
        ));
      
        return result.Item;
    }

    async getAuctionsByStatus(status: string) : Promise<any>
    {
        const params: QueryCommandInput = {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
              ":status": { S: status },
            },
            ExpressionAttributeNames: {
              '#status' : 'status'
            }
        };

        const result = await this.dynamoDbClient.send(new QueryCommand(params));
        return result.Items;
    }

    async updateAuctionBid(auction: AuctionBidCreationDto) : Promise<any>
    {
        let updatedAuction:UpdateCommandOutput; 
        
        const params: UpdateCommandInput = {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            Key: { id: auction.auction_id},
            UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
            ExpressionAttributeValues: {
                ':amount': auction.bid_amount,
                ':bidder': auction.email,
              },
              ReturnValues: 'ALL_NEW',
        };

        updatedAuction =  await this.dynamoDbClient.send(new UpdateCommand(params));
        return updatedAuction.Attributes;
    }
    
    async getCompletedAuctions(): Promise<any>
    {
        const now = new Date();

        const params: QueryCommandInput = {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status AND bid_ending_at <= :now',
            ExpressionAttributeValues: {
                ':status': { S: 'OPEN' },
                ':now' : { S: now.toISOString() }
            },
            ExpressionAttributeNames: {
                '#status' : 'status'
            }
        };
        
        const result = await this.dynamoDbClient.send(new QueryCommand(params));
        return result.Items;
    }

    async updateAuctionImageUrl(id: string, imageUrl: string) 
    {
        const params: UpdateCommandInput = 
        {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set image_url = :image_url',
            ExpressionAttributeValues: {
              ':image_url': imageUrl,
            },
            ReturnValues: 'ALL_NEW',
        };

        const result = await this.dynamoDbClient.send(new UpdateCommand(params));
        return result.Attributes;
    }

    async closeAuction(auction_id: string) 
    {
        const params:UpdateCommandInput = {
            TableName: process.env.CAR_AUCTIONS_TABLE_NAME,
            Key: { id: auction_id },
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeValues: {
              ':status': 'CLOSED',
            },
            ExpressionAttributeNames: {
              '#status': 'status',
            },
          }; 
          
          await this.dynamoDbClient.send(new UpdateCommand(params));
    }
    
}