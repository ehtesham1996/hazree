import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import serverless from 'serverless-http';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyStructuredResultV2,
  Context
} from 'aws-lambda';
import { router } from './router';
import Acl from './hazree.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const app: Application = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/bot', router(Acl));

const serverlessApp = serverless(app);
const handler = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context):
Promise<APIGatewayProxyResult | APIGatewayProxyStructuredResultV2> => {
  console.log(event);

  return serverlessApp(event, context);
};

export { handler };
