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
 * @description Add member to team by email and send them invites
 */
const AddTeamMembers: APIGatewayAuthenticatedHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const {
      user_id: userId = '',
      email: userEmail = ''
    } = event.user;

    const payload = JSON.parse(event.body);
    const {
      teamId = '',
      emails = []
    }: { teamId: string; emails: string[] } = payload;

    if (!teamId) throw new BadRequestError('Invalid team specified to fetch member');
    if (emails.length === 0) throw new BadRequestError('Please specify emails you want to invite');

    await teamService.addBulkMembersService(userId, null, emails, teamId, userEmail);
    return new APIResponse().success('Member(s) invited successfully');
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};

export const handler = middy(AddTeamMembers).use(authorize());
