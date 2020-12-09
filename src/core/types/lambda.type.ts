import { UsersDocument } from '@src/database';
import {
  APIGatewayProxyResult,
  APIGatewayProxyWithCognitoAuthorizerEvent,
  Handler
} from 'aws-lambda';

export type APIGatewayAuthenticatedEvent =
  APIGatewayProxyWithCognitoAuthorizerEvent
  & { user?: UsersDocument };

export type APIGatewayAuthenticatedHandler =
  Handler<APIGatewayAuthenticatedEvent, APIGatewayProxyResult>;
