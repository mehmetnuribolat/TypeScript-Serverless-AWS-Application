import { handlerPath } from '@libs/handler-resolver';


export const createCarAuction = {
    handler: `${handlerPath(__dirname)}/handler.createCarAuction`,
    events: [
        {
            http: {
                method: 'POST',
                path: '/car-auction',
                authorizer: "${self:custom.authorizer}"
            },
        },
    ],
};

export const getCarAuction = {
    handler: `${handlerPath(__dirname)}/handler.getCarAuction`,
    events: [
        {
            http: {
                method: 'GET',
                path: '/car-auction/{id}',
                authorizer: "${self:custom.authorizer}"
            },
        },
    ],
};

export const getCarAuctions = {
    handler: `${handlerPath(__dirname)}/handler.getCarAuctions`,
    events: [
        {
            http: {
                method: 'GET',
                path: '/car-auctions',
                authorizer: "${self:custom.authorizer}"
            },
        },
    ],
};

export const createBid = {
    handler: `${handlerPath(__dirname)}/handler.createBid`,
    events: [
        {
            http: {
                method: 'PATCH',
                path: '/car-auction/{id}/bid',
                authorizer: "${self:custom.authorizer}"
            },
        },
    ],
};

export const uploadAuctionImage = {
    handler: `${handlerPath(__dirname)}/handler.uploadAuctionImage`,
    events: [
        {
            http: {
                method: 'PATCH',
                path: '/car-auction/{id}/image',
                cors:true,
                authorizer: "${self:custom.authorizer}"
            },
        },
    ],
};

export const closeCarAuctions = {
    handler: `${handlerPath(__dirname)}/handler.closeCarAuctions`,
    events: [
        {
            eventBridge: {
                schedule: "rate(1 minute)",
            },
        },
    ],
};
