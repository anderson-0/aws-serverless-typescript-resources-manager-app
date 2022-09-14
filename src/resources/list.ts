import { Context } from 'aws-lambda'
import AWS from 'aws-sdk'

export async function handler(event: any, context: Context) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  const params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
    KeyConditionExpression: 'serverId = :serverId',
    ExpressionAttributeValues: {
      ':serverId': event.requestContext.authorizer.serverId,
    },
  }

  const response = await dynamoDb.query(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  }
}