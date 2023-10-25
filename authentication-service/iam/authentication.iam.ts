export const AuthenticationIAM = 
{
    Effect: "Allow",
    Action: [
      "cognito-idp:AdminInitiateAuth",
      "cognito-idp:AdminCreateUser",
      "cognito-idp:AdminSetUserPassword"
    ],
    Resource: "*"
}