import { APIGatewayProxyResult } from 'aws-lambda';
import { prisma } from './prisma';

export async function verifyCredentials(event: any) {
  const apiClientId = event.headers.api_client_id;
  const apiClientPassword = event.headers.api_client_password;
  
  if (apiClientId === undefined || apiClientPassword === undefined) {
    return null
  }

  const server = await prisma.server.findFirst({
    where: {
      AND: [
        {
          apiClientId,
        },
        {
          apiClientPassword,
        },
      ],
    },
  });
  if (!server) {
    return null
  }

  return server.id
}

export async function handler(event: any): Promise<APIGatewayProxyResult> {
  const apiKey = event.headers.api_key
  console.log(apiKey)

  const verifiedKey = await verifyCredentials(apiKey);
  console.log(`verifiedKey: ${JSON.stringify(verifiedKey)}`);
  console.log(`verified key truthy: ${!!verifiedKey}`);
  const isVerified = !!verifiedKey// Do something to check if user is active or similar

  const policy = isVerified ? 'Allow' : 'Deny';
  console.log(`Allow Access? ${isVerified}`);

  return generatePolicy('user', policy, event.methodArn, apiKey)
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     policy: generatePolicy('user', policy, event.methodArn, apiKey),
  //     allowed: isVerified
  //   })
  // }
}

/**
 * @description Creates the IAM policy for the response.
 */
const generatePolicy = (principalId: string, effect: string, resource: string, serverId: string) => {
  const authResponse: any = {
    principalId
  };

  if (effect && resource) {
    const policyDocument: any = {
      Version: '2012-10-17',
      Statement: []
    };

    const statement = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    };

    policyDocument.Statement[0] = statement;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    serverId: serverId
    //role: user.role --> "principalId" could be an object that also has role
  };

  console.log('authResponse', authResponse);

  return authResponse;
};