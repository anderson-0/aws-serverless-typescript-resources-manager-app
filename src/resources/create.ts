import { verifyCredentials } from '../auth'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../prisma/prisma'

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

  const countResources = await prisma.resource.count()

  if (countResources >= 200) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Maximum number of resources reached',
      }),
    }
  }

  const resource = await prisma.resource.create({
    data: {
      serverId,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      state: 'creating',
    },
  })


  return {
    statusCode: 200,
    body: JSON.stringify(resource),
  }
}