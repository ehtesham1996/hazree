import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIResponse,
  extractUserBaseData,
  timeSince,
  UserBaseData
} from '@src/core';
import moment from 'moment-timezone';
import {
  AttendanceDocument, AttendanceModel, UsersDocument, UsersModel
} from '@src/database';
import { SortOrder } from 'dynamoose/dist/General';

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
};

/**
 * @description Admin portal, Get all members of a team.
 */
export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const tz = 'Asia/Karachi';

    /**
     * For time being supposing admin user object until login credentials are finalized.
     */
    // const requestingUser = new UsersModel({
    //   user_id: 'Admin',
    //   name: 'Admin',
    //   tz: 'Asia/Karachi'
    // });

    /**
     * Get all users.
     */
    const allUsers: UsersDocument[] = await UsersModel.scan().all().exec();

    const teamAllMembers: Array<teamAllMembersType> = await Promise.all(
      allUsers.map(async (user) => {
        // const teamAllMemebers = await Promise.all(
        // allUsers.map(async (user) => {
        const userBaseData = extractUserBaseData(user);
        let lastActivity = 'N/A';
        let activitySince = 'N/A';
        let activityDate = 'N/A';
        let time = '00:00';
        let color = 'N/A';

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

          return {
            ...userBaseData,
            lastActivity,
            activitySince,
            activityDate,
            time,
            color
          };
        }
        return {
          ...userBaseData,
          lastActivity,
          activitySince,
          activityDate,
          time,
          color
        };
      })
    );

    return new APIResponse().success('OK', { teamAllMembers });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};
