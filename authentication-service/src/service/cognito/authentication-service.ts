import { AdminCreateUserCommand, AdminInitiateAuthCommand, AdminSetUserPasswordCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { ConfigSettings } from "src/constants/constants";
import { CognitoJwtVerifier } from "aws-jwt-verify";
export default class AuthenticationService {
    constructor(private awsCognitoClient: CognitoIdentityProviderClient ){}

    async initiateAuth(email:string, password: string): Promise<any> 
    {
        const params = new AdminInitiateAuthCommand(
            {
                AuthFlow: "ADMIN_NO_SRP_AUTH",
                UserPoolId: ConfigSettings.USER_POOL,
                ClientId: ConfigSettings.USER_POOL_CLIENT,
                AuthParameters: {
                  USERNAME: email,
                  PASSWORD: password
                }
              }
        );

        const result = await this.awsCognitoClient.send(params)
        return result.AuthenticationResult;
    }

    async createUser(email:string): Promise<any> 
    {
        const command = new AdminCreateUserCommand(
        {
            UserPoolId: ConfigSettings.USER_POOL,
            Username: email,
            UserAttributes: [
            {
                Name: "email",
                Value: email
            },
            {
                Name: "email_verified",
                Value: "true"
            }
            ],
            MessageAction: "SUPPRESS"
        });
        const result = await this.awsCognitoClient.send(command);
        return result.User;
    }
    async setUserPassword(email:string, password:string): Promise<any> 
    {
        const command = new AdminSetUserPasswordCommand(
        {
            Password: password,
            UserPoolId: ConfigSettings.USER_POOL,
            Username: email,
            Permanent: true
        });
        const result = await this.awsCognitoClient.send(command);
        return result;
    }

    async verifyAuthToken(token:string) 
    {
        console.log( ConfigSettings.USER_POOL, " ", ConfigSettings.USER_POOL_CLIENT);
        const verifier = CognitoJwtVerifier.create({
            userPoolId: ConfigSettings.USER_POOL,
            tokenUse: "access",
            clientId: ConfigSettings.USER_POOL_CLIENT,
          });
          try 
          {
            const payload = await verifier.verify(token);
            return payload;
          }catch(err)
          {
            console.log("Invalid Token = > " + err);
            return null;
          }
          

    }
}