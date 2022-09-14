import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

export async function handler(event: any, context: Context) {
  const { serverId } = event.requestContext.authorizer

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  
  let params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
    KeyConditionExpression: 'serverId = :serverId',
    ExpressionAttributeValues: {
      ':serverId': serverId,
    },
    Select: 'COUNT',
  }

  const response = await dynamoDb.query(params).promise()
  if (response.Count as number >= 200) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Maximum number of resources reached',
      }),
    }
  }

  const resource = {
    serverId: serverId,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: 'creating',
  }

  params = {
    TableName: process.env.RESOURCES_TABLE as string,
    Item: resource
  }

  await dynamoDb.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(resource),
  }
}