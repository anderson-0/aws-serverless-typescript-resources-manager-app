import { APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
async function verifyKey(apiKey: string) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.SERVERS_TABLE as string,
    Key: {
      id: apiKey,
    },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item || null;
}

export async function handler(event: any): Promise<APIGatewayProxyResult> {
  const apiKey = event.headers.api_key
  console.log(apiKey)

  const active = !!apiKey || !verifyKey(apiKey)// Do something to check if user is active or similar

  const policy = active ? 'Allow' : 'Deny';
  console.log(`Is user active? ${active}`);

  return generatePolicy('user', policy, event.methodArn, apiKey);
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