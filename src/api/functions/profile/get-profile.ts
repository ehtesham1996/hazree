import {
  APIGatewayAuthenticatedHandler, APIResponse, BadRequestError, HttpError
} from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';
import { getUserLastActivity } from '@src/services';
import moment from 'moment-timezone';

/**
 * @description A simple get profile lambda function that is called when
 *              /profile endpoint is called with headers
 */
const GetProfile: APIGatewayAuthenticatedHandler = async (event) => {
  try {
    const {
      user_id: userId = '',
      name = '',
      email = '',
      profile_picture: profilePicture = ''
    } = event.user;

    const { tz } = event.headers;
    if (moment.tz.zone(tz) === null) {
      throw new BadRequestError('Invalid timezone specified to fetch data');
    }

    const [
      teams,
      lastActivityData
    ] = await Promise.all([
      teamService.getUserTeams(userId, false, true),
      getUserLastActivity(userId, tz)
    ]);

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
        teamExists,
        lastActivityData
      });
  } catch (error) {
    if (error instanceof HttpError) {
      return new APIResponse().error(error.statusCode, error.message);
    }
    return new APIResponse().error();
  }
};

export const handler = middy(GetProfile).use(authorize());
