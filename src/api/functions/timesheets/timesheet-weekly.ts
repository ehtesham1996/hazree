import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIResponse, BadRequestError, convertSecondToHHMM, UserBaseDataForTimeSheet
} from '@src/core';
import moment from 'moment-timezone';
import { AttendanceModel, connectToDatabase, UserModel } from '@src/database';
import { extractUserBaseData } from './user-data-timesheet';

interface WeekDays {
  saturday: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

type UserWeeklyData = UserBaseDataForTimeSheet & { total: string } & WeekDays;

/**
 * @description Timesheets admin panel funtion to return monthly timesheets of users.
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const { isoWeekYear = null, isoWeekNumber = null } = event.queryStringParameters || {};

    /**
     * For time being supposing admin user object until login credentials are finalized.
     */
    const requestingUser = new UserModel({
      _id: 'adminId',
      user_id: 'Admin',
      real_name: 'Admin',
      tz: 'Asia/Karachi'
    });

    const dateParsed = moment().isoWeekYear(+isoWeekYear).isoWeek(+isoWeekNumber).tz(requestingUser.tz);

    if (!dateParsed.isValid() || isoWeekYear === null || isoWeekYear === null) {
      throw new BadRequestError('Please specify the year and week');
    }

    const wStart = dateParsed.startOf('isoWeek').unix();
    const wEnd = dateParsed.endOf('isoWeek').unix();

    await connectToDatabase(context);
    /**
     * Get all users, and get all attendance for each user
     */
    const allUsers = await UserModel.find();
    const usersWeeklyData: Array<UserWeeklyData> = await Promise.all(allUsers.map(async (user) => {
      const query = {
        team_id: user.team_id,
        user_id: user.user_id,
        date: {
          $gte: wStart,
          $lte: wEnd
        }
      };
      const attendances = await AttendanceModel.find(query);

      let total = 0;
      const dailyData: WeekDays = {
        saturday: '00:00',
        sunday: '00:00',
        monday: '00:00',
        tuesday: '00:00',
        wednesday: '00:00',
        thursday: '00:00',
        friday: '00:00'
      };

      for (const currentDate = moment(wStart * 1000).tz(requestingUser.tz);
        currentDate.isBefore(moment(wEnd * 1000).tz(requestingUser.tz));
        currentDate.add(1, 'days')) {
        const dailyStartTime = moment(currentDate.unix() * 1000).tz(requestingUser.tz).startOf('day').unix();
        const dailyEndingTime = moment(currentDate.unix() * 1000).tz(requestingUser.tz).endOf('day').unix();

        const currentDateData = attendances.find((attendance) => attendance.date >= dailyStartTime && attendance.date <= dailyEndingTime);

        /**
                 * Sum of all sessions durations
                 * Session without out_stamp will be replaced with end of day.
                 */
        const dailyTotalH = (currentDateData && currentDateData.sessions.reduce(
          (a, b) => a
            + (b.out_stamp
              ? b.out_stamp - b.in_stamp
              : moment(currentDateData.date * 1000).tz(requestingUser.tz).endOf('day').unix() - b.in_stamp
              || 0),
          0
        )) || 0;

        total += dailyTotalH;
        const time = convertSecondToHHMM(dailyTotalH);

        dailyData[currentDate.format('dddd').toLowerCase()] = time;
      }

      const userBaseData = extractUserBaseData(user);
      /**
               * Using hardcoded image URL temporarily
               */
      return {
        ...userBaseData,
        total: convertSecondToHHMM(total),
        ...dailyData
      };
    }));

    return new APIResponse().success('OK', { usersWeeklyData });
  } catch (error) {
    console.log(error.message);
    return new APIResponse().error(error.statusCode, error.message);
  }
};
