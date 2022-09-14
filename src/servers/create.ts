import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const { name } = JSON.parse(event.body || '{}');
  const id = uuidv4();
  const params = {
    TableName: process.env.SERVERS_TABLE as string,
    Item: {
      id,
      name,
    },
  };

  const result = await dynamoDb.put(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  }
}