import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import AWS from 'aws-sdk'

export async function handler(event: any, context: Context) {
  const { serverId } = event.requestContext.authorizer
  const { state } = JSON.parse(event.body)

  const validActions: any = {
    'start': 'starting',
    'stop': 'stopping',
    'restart': 'restarting',
  }

  if (Object.keys(validActions).indexOf(state) === -1) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid state',
      }),
    }
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()

  const params: any = {
    TableName: process.env.RESOURCES_TABLE as string,
    Key: {
      serverId: serverId,
      id: event.pathParameters.id,
    },
    
    UpdateExpression: '#state = :state, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#state': 'state',
      '#updatedAt': 'updatedAt',
    },
    ExpressionAttributeValues: {
      ':state': validActions[state],
      ':updatedAt': new Date().toISOString(),
    },
  }

  await dynamoDb.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: event.pathParameters.id,
      state: validActions[state],
    }),
  }
}