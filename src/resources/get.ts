import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

export async function handler(event: any, context: Context) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const { id } = event.pathParameters

  const params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
    KeyConditionExpression: 'id = :id and serverId = :serverId',
    ExpressionAttributeValues: {
      ':id': id,
      ':serverId': event.requestContext.authorizer.serverId,
    },
  }

  const response = await dynamoDb.query(params).promise()

  if (response.Items?.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Resource not found',
      }),
    }
  }
  const resource = response.Items ? response.Items[0] : null
  return {
    statusCode: 200,
    body: JSON.stringify(resource),
  }
}