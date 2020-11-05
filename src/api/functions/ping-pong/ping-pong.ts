import { APIResponse } from '@src/core/types';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

/**
 * @description A simple Pong lambda function that is called when
 *              /ping endpoint is called
 */
export const handler: APIGatewayProxyHandler = async () => {
  console.log('ENV:', process.env.DB_URI);
  return new APIResponse()
    .success('PONG! Server is working');
};
