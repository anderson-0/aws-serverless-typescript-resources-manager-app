import { prisma } from '../../prisma/prisma'
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

  const deletedResources = await prisma.resource.deleteMany({
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

  return {
    statusCode: 204,
  }
}