import AuthenticationService from "./authentication-service";
import awsCognitoClient from "./cognito-client.service";


const authenticationService = new AuthenticationService(awsCognitoClient());

export default authenticationService;


