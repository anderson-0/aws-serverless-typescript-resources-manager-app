import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

export async function handler(event: any, context: Context) {
  const validActions: any = {
    'starting': 'started',
    'stopping': 'stopped',
    'restarting': 'started',
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  const params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
  }

  const resources = await dynamoDb.scan(params).promise()

  resources.Items?.map(async (resource: any) => {
    await dynamoDb.put({
      TableName: process.env.RESOURCES_TABLE as string,
      Item: {
        ...resource,
        state: validActions[resource.state],
        updatedAt: new Date().toISOString(),
      },
    }).promise()
  })
}