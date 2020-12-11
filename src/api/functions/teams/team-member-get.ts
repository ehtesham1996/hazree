import {
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIGatewayAuthenticatedHandler,
  APIResponse,
  BadRequestError,
  extractUserBaseData,
  timeSince,
  UserBaseData
} from '@src/core';
import moment from 'moment-timezone';
import {
  AttendanceDocument, AttendanceModel
} from '@src/database';
import { SortOrder } from 'dynamoose/dist/General';
import middy from 'middy';
import * as teamService from '@src/services/team.service';
import authorize from '../auth/authorize.middleware';

/**
 * Color variable used for teams page
 * to be used dynamically later with settings
 */
const Color = {
  inColor: '#00366F',
  outColor: '#ccc'
};

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
        let lastActivity = '';
        let activitySince = '';
        let activityDate = '';
        let time = '00:00';
        let color = '';

        /**
         * Get latest entry
         */
        const attendances: AttendanceDocument[] = await AttendanceModel
          .query('user_id')
          .eq(user.user_id)
          .sort(SortOrder.descending)
          .exec();

        if (attendances.length >= 1 && attendances[0].sessions.length > 0) {
          const lastSession = attendances[0].sessions[attendances[0].sessions.length - 1];
          if (lastSession.out_stamp > 0 && lastSession.in_stamp > 0) {
            lastActivity = 'out';
            activitySince = timeSince(lastSession.out_stamp * 1000);
            time = moment(lastSession.out_stamp * 1000)
              .tz(tz)
              .format('HH:MM');
            activityDate = moment(lastSession.out_stamp * 1000)
              .tz(tz)
              .format('MM-DD-YYYY');
            color = Color.outColor;
          } else if (lastSession.in_stamp > 0 && lastSession.out_stamp === 0) {
            lastActivity = 'in';
            activitySince = timeSince(lastSession.in_stamp * 1000);
            time = moment(lastSession.in_stamp * 1000)
              .tz(tz)
              .format('HH:MM');
            activityDate = moment(lastSession.in_stamp * 1000)
              .tz(tz)
              .format('MM-DD-YYYY');
            color = Color.inColor;
          }
        }
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
