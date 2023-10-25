export default class CarAuction {
    id: string;
    chasis: string;
    make: string;
    model: string;
    color: string;
    year : number;
    bid_started_at: string;
    bid_ending_at: string;
    highestBid: {
        amount: number;
        bidder:string;
    };
    seller: string;
    status: string;
    image_url: string;
}