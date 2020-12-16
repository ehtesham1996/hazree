import {
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIGatewayAuthenticatedHandler,
  APIResponse,
  BadRequestError
} from '@src/core';
import middy from 'middy';
import * as teamService from '@src/services/team.service';
import authorize from '../auth/authorize.middleware';

/**
 * @description REmove member from team by userId
 */
const RemoveTeamMembers: APIGatewayAuthenticatedHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const {
      user_id: userId = ''
    } = event.user;
    const {
      teamId = '',
      userId: memberId = ''
    } = event.queryStringParameters;

    if (!teamId) throw new BadRequestError('Invalid team specified to fetch member');
    if (!memberId) throw new BadRequestError('Please specify the member you want to remove');

    await teamService.removeMember(userId, teamId, memberId);
    return new APIResponse().success('Member removed successfully');
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};

export const handler = middy(RemoveTeamMembers).use(authorize());
