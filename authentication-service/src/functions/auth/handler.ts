import  commonMiddleware  from "@libs/lambda";
import authenticationService from '../../service/cognito';
import { formatJSONResponse } from "@libs/api-gateway";

export const login = commonMiddleware(async (event: any): Promise<any> => {
    try 
    {
        const { email, password } = event.body;

        const response = await authenticationService.initiateAuth(
            email,
            password
        );
        return formatJSONResponse({
            status: 200,
            token: response
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse({
            status: 500,
            message: err
        });
    }
});

export const register = commonMiddleware(async (event: any): Promise<any> => {
    try 
    {
        const { email, password } = event.body;

        const user = await authenticationService.createUser(email);
        if(user) 
        {
            await authenticationService.setUserPassword(email,password);
        }

        return formatJSONResponse({
            status: 201,
            message: `User registration successful!` 
        });

    }catch(err) 
    {
        console.error(err);
        return formatJSONResponse({
            status: 500,
            message: {err}
        });
    }
});

export const auth = commonMiddleware(async (event: any): Promise<any> => {
    try 
    {
        if(!event.authorizationToken) 
        {
            throw 'Unauthorized';
        }

        const authToken = event.authorizationToken.split(" ")[1];
        console.log(authToken);

        const payload = await authenticationService.verifyAuthToken(authToken);
        console.log(payload);
        if(!payload) {
            throw 'Unauthorized';
        }
        
        const policy = generatePolicy(payload.sub, event.methodArn);

        return {
            ...policy,
            context: payload
        };

    }catch(err) 
    {
        console.error(err);
        throw 'Unauthorized';
    }
});

function generatePolicy (principalId, methodArn) {
    const apiGatewayWildcard = methodArn.split('/', 2).join('/') + '/*';

    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: apiGatewayWildcard,
          },
        ],
      },
    };
  };