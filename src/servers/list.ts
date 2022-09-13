import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk';

export async function handler(event: APIGatewayProxyEvent, context: Context) {

  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.SERVERS_TABLE as string,
  };

  const result = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  }
}