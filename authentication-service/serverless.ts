import type { AWS } from '@serverless/typescript';

import {AuthenticationIAM} from './iam/authentication.iam';
import { login, register, auth } from './src/functions/auth';

const serverlessConfiguration: AWS = {
  service: 'auth-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    memorySize: 256,
    region: 'eu-west-1',
    stage: "${opt:stage, 'dev'}",
    iam: {
      role: {
        statements: [AuthenticationIAM]
      }
    },
    environment: {
      USER_POOL: { 'Ref': 'UserPool'} ,
      USER_POOL_CLIENT: { 'Ref': 'UserClient'}
    },
    httpApi: {
      cors: true,
      authorizers: {
        userAuthoriser: {
          identitySource: "$request.header.Authorization",
          issuerUrl: {"Fn::Join": ["", ["https://cognito-idp.eu-west-1.amazonaws.com/", { 'Ref': 'UserPool'}]]},
          audience: { 'Ref': 'UserClient'}
        }
      }
    }
  },
  functions: { auth, login, register},
  resources: {
    Resources: {
      UserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "${self:service}-pool-${sls:stage}",
          Schema: [
            {
              Name: "email",
              Required: true,
              Mutable: true
            }
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength : 6
            }
          },
          AutoVerifiedAttributes: ["email"] 
        }
      },
      UserClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "${self:service}-client-${sls:stage}",
          GenerateSecret: false,
          UserPoolId: { 'Ref': 'UserPool'},
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH"]
        }
      }
    }
  },
  package: { individually: true },
  custom: {
  },
};

module.exports = serverlessConfiguration;
