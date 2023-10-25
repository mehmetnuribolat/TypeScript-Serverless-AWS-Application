import  commonMiddleware  from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult, EventBridgeEvent } from "aws-lambda";
import auctionService from "../../service/dynamodb";
import CarAuction from "../../model/db/car-auction.model";
import { v4 } from "uuid";
import { formatJSONResponse } from "@libs/api-gateway";
import AuctionBidCreationDto from "src/model/dtos/auction-bid.dto";
import s3ImageService from "src/service/s3";
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import {uploadImageSchema, createCarAuctionSchema, placeBidSchema,getCarAuctionsSchema} from "src/model/event-schema";
import notificationService from "src/service/sqs";

export const createCarAuction = commonMiddleware(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try 
    {   
        const requestBody = event.body as any;
        const { username } = event.requestContext.authorizer;
        console.error(requestBody); 

        const now = new Date();
        const endDate = new Date();
        endDate.setHours(now.getHours() + 1); 

        let auction: CarAuction = {
            id: v4(),
            chasis: requestBody.chasis,
            make: requestBody.make,
            model: requestBody.model,
            year: requestBody.year,
            color: requestBody.color,
            status: "OPEN",
            seller: username,
            highestBid: {
                amount:0,
                bidder: ""
            },
            bid_started_at: now.toISOString(),
            bid_ending_at: endDate.toISOString(),
            image_url: ""
        };
        console.log(auction);
        const result = await auctionService.createAuction(auction);
        
        return formatJSONResponse(201, {
            message: result
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
}).use(validator({ eventSchema: transpileSchema(createCarAuctionSchema) })); // validates the input;

export const getCarAuction = commonMiddleware(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try 
    {
        const { id } = event.pathParameters;

        const auction = await auctionService.getAuctionById(id);

        if(!auction) {
            return formatJSONResponse(404, {
                message: `Car Auction with ID "${id}" not found!`
            }); 
        }

        return formatJSONResponse(200, {
            auction
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
});

export const getCarAuctions = commonMiddleware(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try 
    {
        const status = event.queryStringParameters.status;
        console.error(status);
        const auctions = await auctionService.getAuctionsByStatus(status);
        return formatJSONResponse(200,{
            auctions
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
}).use(validator({ eventSchema: transpileSchema(getCarAuctionsSchema), })); // validates the input;

export const createBid = commonMiddleware(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try 
    {
        const { id } = event.pathParameters;
        const { amount } = event.body as any;
        const { username } = event.requestContext.authorizer;
        
        const auctionToBid = await auctionService.getAuctionById(id);

        if(!auctionToBid) {
            return formatJSONResponse(404,{
                message: 'Car Auction record could not be found!'
            });
        }

        if (username === auctionToBid.seller) {
            return formatJSONResponse(400,{
                message: `You cannot bid on your own auctions!` 
            });
        }

        if (username === auctionToBid.highestBid.bidder) {
            return formatJSONResponse(400,{
                message: `You are already the highest bidder`
            });
        }

        if (auctionToBid.status !== 'OPEN') {
            return formatJSONResponse(400,{
                message: `You cannot bid on closed auctions!`
            });
        }
        
        if (amount <= auctionToBid.highestBid.amount) 
        {
            return formatJSONResponse(400,{
                message:`Your bid must be higher than ${auctionToBid.highestBid.amount}!`
            });
        }
        const bid: AuctionBidCreationDto = {
            auction_id: id,
            bid_amount: amount,
            email: username,
        };

        const bidResult = await auctionService.updateAuctionBid(bid); 

        return formatJSONResponse(200,{
            bidResult
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
}).use(validator({ eventSchema: transpileSchema(placeBidSchema) })); // validates the input;

export const uploadAuctionImage = commonMiddleware(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try 
    {
        const { id } = event.pathParameters;
        const { username } = event.requestContext.authorizer;

        const auctionToUpdate = await auctionService.getAuctionById(id);

        if(!auctionToUpdate) {
            return formatJSONResponse(404,{
                message: 'Car Auction record could not be found!'
            });
        }

        if (auctionToUpdate.seller !== username) 
        {
            return formatJSONResponse(400,{
                message: 'You are not the seller of this auction!'
            });
        }
        let encodedImage = event.body as any;
        const base64 = encodedImage.content.replace(/^data:image\/\w+;base64,/, '');
        let decodedImage = Buffer.from(base64, 'base64');

        let updatedAuction;
        const imageUrl = await s3ImageService.uploadPicture(auctionToUpdate.id + '.jpg', decodedImage);
        updatedAuction = await auctionService.updateAuctionImageUrl(auctionToUpdate.id, imageUrl);

        return formatJSONResponse(200,{
            updatedAuction
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
}).use(validator({ eventSchema: transpileSchema(uploadImageSchema) })); // validates the input;

export const closeCarAuctions = commonMiddleware(async (event: EventBridgeEvent<any, any>): Promise<any> => {
    try 
    {
        console.error(event);
        const auctions = await auctionService.getCompletedAuctions();
        console.error('Auction Close Started');
        const closePromises = auctions.map(auction => closeCarAuction(auction));
        await Promise.all(closePromises);
        console.error('Auction Close Completed');

        const result: any = 
        { 
            closed: closePromises.length 
        };

        return formatJSONResponse(200,{
            result
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse(500, {
            message: err
        });
    }
});

async function closeCarAuction(auction: any) 
{   
    console.error(auction);
    await auctionService.closeAuction(auction.id.S); //DynamoDB OBject
    const { make, model, year, highestBid, seller } = auction;
    const { amount, bidder } = highestBid;

    if(amount.N === 0) 
    {
      await notificationService.sendNotification(
        'No bids on your auction :>',
        `Oh no! Your car "${year.N}-${make.S} ${model.S}" didnt get any bids.!`,
        seller.S);
    return;
    }

    const notifySeller = notificationService.sendNotification(
        'Your car has been sold!',
        `Woohoo! Your car "${year.N}-${make.S} ${model.S}" has been sold for $${amount.N}.`,
        seller.S,
    );

    const notifyBidder = notificationService.sendNotification(
        'You won an car auction!',
        `What a great deal! Yo got yourself a "${year.N}-${make.S} ${model.S}" for $${amount.N}.`,
        bidder.S
    );

    return Promise.all([notifySeller, notifyBidder]);

}













