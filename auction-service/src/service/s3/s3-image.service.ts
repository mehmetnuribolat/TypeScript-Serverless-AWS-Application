import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export default class S3ImageService {
    constructor(private s3Client: S3Client){}
     
    async uploadPicture(key: string, body:any) 
    {
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.CAR_AUCTIONS_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        });
        
        const result = await this.s3Client.send(uploadCommand);
        console.log(result);
        const url = `https://${process.env.CAR_AUCTIONS_BUCKET_NAME}.s3.${'eu-west-1'}.amazonaws.com/${key}`;
        return url;
    } 
}