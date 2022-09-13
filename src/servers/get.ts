import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk';

export async function handler(event: APIGatewayProxyEvent, context: Context) {

  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing path parameters',
      }),
    }
  }

  const serverId = event.pathParameters.id

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.SERVERS_TABLE as string,
    Key: {
      id: serverId,
    },
  };

  const result = await dynamoDb.get(params).promise();
  const server = result.Item;

  if (!server) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Server not found',
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  }
}