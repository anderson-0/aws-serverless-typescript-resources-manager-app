import { prisma } from '../../prisma/prisma'
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
  
  const { state } = JSON.parse(event.body)
  const { id } = event.pathParameters

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

  await prisma.resource.updateMany({
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
    data: {
      state: validActions[state],
    }
  })


  return {
    statusCode: 200,
    body: JSON.stringify({
      id: event.pathParameters.id,
      state: validActions[state],
    }),
  }
}