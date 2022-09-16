import { prisma } from '../prisma'
import { verifyCredentials } from '../auth'

export async function handler(event: any) {
  const { id } = event.pathParameters
  const serverId = await verifyCredentials(event)
  
  if (serverId === null) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Unauthorized'
      })
    }
  }
  
  const resource = await prisma.resource.findFirst({
    where: {
      AND: [
        {
          id
        },
        {
          serverId
        }
      ]
    },
  })

  if (resource === null) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Resource not found',
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(resource),
  }
}