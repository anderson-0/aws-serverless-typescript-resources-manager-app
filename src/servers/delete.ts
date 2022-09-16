import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { prisma } from '../../prisma/prisma'

export async function handler(event: any) {
  try {
    const id = event.pathParameters.id
    await prisma.server.delete({
      where: {
        id
      },
    })

    return {
      statusCode: 204,
      body: JSON.stringify({}),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
}