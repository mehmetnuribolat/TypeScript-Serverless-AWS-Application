import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const awsCognitoClient = (): CognitoIdentityProviderClient => 
{
    //You can add other configurations
    return new CognitoIdentityProviderClient({
        apiVersion: '2010-12-01',
        region: 'eu-west-1',
    });
};
export default awsCognitoClient;