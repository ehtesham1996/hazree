/* eslint-disable no-param-reassign */
import middy from 'middy';
import { UsersModel } from '@src/database';
import { APIGatewayAuthenticatedEvent, APIResponse } from '@src/core';

const authorize: middy.Middleware<any, any> = () => {
  const middlewareObject: middy.MiddlewareObject<any, any> = {
    before: async (handler: middy.HandlerLambda<APIGatewayAuthenticatedEvent, any>, next) => {
      try {
        const userId = handler.event.requestContext.authorizer?.claims?.['cognito:username'];
        console.log(handler.event.requestContext.authorizer);

        if (!userId) throw new Error('Request not authorized');

        const userData = (await UsersModel.query('user_id').eq(userId).exec())[0];

        if (!userData) throw new Error('Invalid user');

        handler.event.user = userData;

        return next();
      } catch (error) {
        const response = new APIResponse().unAuthorized(error.message);
        return handler.callback(null, response);
      }
    }
  };

  return middlewareObject;
};

export default authorize;
