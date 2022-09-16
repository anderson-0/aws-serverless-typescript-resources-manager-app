import { prisma } from '../prisma'

export async function handler() {
  const validActions: any = {
    'creating': 'started',
    'starting': 'started',
    'stopping': 'stopped',
    'restarting': 'started',
  }

  Object.entries(validActions).forEach(async ([state, newState]) => {
    await prisma.resource.updateMany({
      where: {
        state
      },
      data: {
        state: newState as string,
      },
    })
  })
}