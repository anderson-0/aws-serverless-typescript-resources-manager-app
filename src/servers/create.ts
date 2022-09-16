import { APIGatewayProxyEvent} from 'aws-lambda'
import { faker } from '@faker-js/faker';
import { prisma } from '../../prisma/prisma';

export async function handler(event: APIGatewayProxyEvent) {
  
  const server = await prisma.server.create({
    data: {
      id: faker.internet.password(8, true, /[a-z]/),
      apiClientId: faker.datatype.uuid(),
      apiClientPassword: faker.internet.password(),
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(server),
  }
}