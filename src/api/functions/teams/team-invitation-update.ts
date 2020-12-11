import {
  APIGatewayAuthenticatedHandler,
  APIResponse,
  BadRequestError,
  UpdateTeamAction
} from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';

/**
 * @description A simple post team/invitation lambda function that is called when
 *              POST /team/invitations endpoint is called with headers to either join
 *              or reject a invited team
 */
const UpdateTeamInvitation: APIGatewayAuthenticatedHandler = async (event) => {
  try {
    const {
      email,
      user_id: userId = ''
    } = event.user;

    const payload = JSON.parse(event.body);

    const {
      teamId = '',
      action = ''
    } = payload;

    if (!teamId) {
      throw new BadRequestError('Please specify the team you want to join');
    }

    if (!Object.values(UpdateTeamAction).includes(action)) {
      throw new BadRequestError('You can either accept or reject a team invitation');
    }

    const msg = await teamService.updateTeamInvitation(teamId, email, userId, action === UpdateTeamAction.Accept);

    return new APIResponse()
      .success(msg);
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};

export const handler = middy(UpdateTeamInvitation).use(authorize());
