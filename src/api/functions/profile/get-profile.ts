import { APIGatewayAuthenticatedHandler, APIResponse } from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';

/**
 * @description A simple get profile lambda function that is called when
 *              /profile endpoint is called with headers
 */
const GetProfile: APIGatewayAuthenticatedHandler = async (event) => {
  const {
    user_id: userId = '',
    name = '',
    email = '',
    profile_picture: profilePicture = ''
  } = event.user;

  return new APIResponse()
    .success('User data fetch successfully', {
      userId,
      name,
      email,
      profilePicture
    });
};

export const handler = middy(GetProfile).use(authorize());
