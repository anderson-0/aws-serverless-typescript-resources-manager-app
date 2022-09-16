import { prisma } from '../prisma'
import { verifyCredentials } from '../auth'

export async function handler(event: any) {
  const serverId = await verifyCredentials(event)
  
  if (serverId === null) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Unauthorized'
      })
    }
  }

  const resources = await prisma.resource.findMany()
  
  return {
    statusCode: 200,
    body: JSON.stringify(resources),
  }
}