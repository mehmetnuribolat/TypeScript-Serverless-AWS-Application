import { SESClient } from "@aws-sdk/client-ses";

const awsSESClient = (): SESClient => 
{
    //You can add other configurations
    return new SESClient({
        apiVersion: '2010-12-01',
        region: 'eu-west-1'
    });
};
export default awsSESClient;