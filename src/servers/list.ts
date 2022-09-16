import { APIGatewayProxyEvent } from 'aws-lambda'
import AWS from 'aws-sdk';
import { prisma } from '../../prisma/prisma';

export async function handler(event: APIGatewayProxyEvent) {

  const serversList = await prisma.server.findMany()

  return {
    statusCode: 200,
    body: JSON.stringify(serversList),
  }
}