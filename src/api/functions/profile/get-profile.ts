import { APIGatewayAuthenticatedHandler, APIResponse } from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';

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

  const teams = await teamService.getUserTeams(userId, false, true);

  let teamExists = false;
  if (teams) {
    teamExists = true;
  }

  return new APIResponse()
    .success('User data fetch successfully', {
      userId,
      name,
      email,
      profilePicture,
      teamExists
    });
};

export const handler = middy(GetProfile).use(authorize());
