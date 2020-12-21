import {
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIGatewayAuthenticatedHandler,
  APIResponse,
  BadRequestError,
  extractUserBaseData,
  UserBaseData
} from '@src/core';
import moment from 'moment-timezone';
import middy from 'middy';
import * as teamService from '@src/services/team.service';
import { getUserLastActivity } from '@src/services';
import authorize from '../auth/authorize.middleware';

type teamAllMembersType = UserBaseData & {
  lastActivity: string;
  activitySince: string;
  activityDate: string;
  time: string;
  color: string;
  deletable: boolean;
};

/**
 * @description Admin portal, Get all members of a team.
 */
const GetTeamMembers: APIGatewayAuthenticatedHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const { tz } = event.headers;
    const {
      user_id: userId = ''
    } = event.user;
    const {
      teamId = ''
    } = event.queryStringParameters;

    if (moment.tz.zone(tz) === null) {
      throw new BadRequestError('Invalid timezone specified to fetch data');
    }

    if (!teamId) throw new BadRequestError('Invalid team specified to fetch member');

    const teamMemberData = await teamService.getTeamMembers(teamId, userId);
    const { members: allUsers, teamData } = teamMemberData;

    const teamAllMembers: Array<teamAllMembersType> = await Promise.all(
      allUsers.map(async (user) => {
        // Extracting user data
        const userBaseData = extractUserBaseData(
          user,
          teamData.admins.includes(user.user_id) ? 'Team Admin' : 'Member'
        );

        const {
          lastActivity,
          activityDate,
          activitySince,
          time,
          color
        } = await getUserLastActivity(user.user_id, tz);

        return {
          ...userBaseData,
          lastActivity,
          activitySince,
          activityDate,
          time,
          color,
          deletable: !teamData.admins.includes(user.user_id)
        };
      })
    );

    return new APIResponse().success(`${teamAllMembers.length} member(s) data found`, { teamAllMembers });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};

export const handler = middy(GetTeamMembers).use(authorize());
