import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

export async function handler(event: any, context: Context) {
  const { id } = event.pathParameters

  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  const params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
    Key: {
      id: id,
    },
  }

  await dynamoDb.delete(params).promise()

  return {
    statusCode: 204,
  }
}