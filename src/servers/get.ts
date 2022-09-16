import { APIGatewayProxyEvent } from 'aws-lambda'
import { prisma } from '../prisma';

export async function handler(event: APIGatewayProxyEvent) {

  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing path parameters',
      }),
    }
  }

  const serverId = event.pathParameters.id

  const server = await prisma.server.findUnique({
    where: {
      id: serverId
    }
  })

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
    body: JSON.stringify(server),
  }
}