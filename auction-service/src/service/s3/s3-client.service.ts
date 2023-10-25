import { S3Client  } from "@aws-sdk/client-s3";

const s3Client = (): S3Client => 
{
    //You can add other configurations
    return new S3Client({
        apiVersion: '2010-12-01',
        region: 'eu-west-1'
    });
};
export default s3Client;