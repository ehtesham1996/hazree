import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIResponse, BadRequestError, convertSecondToHHMM, UserBaseDataForTimeSheet
} from '@src/core';
import moment from 'moment-timezone';
import { AttendanceDocument, AttendanceModel, UserModel } from '@src/database';
import { extractUserBaseData } from './user-data-timesheet';

interface DailyData {
  hexColor: string;
  time: string;
  message: string;
  date: string;
}

// For time being declaring color palletes statically
const colorData = [{
  max: 0,
  color: '#BAD1FF'
},
{
  max: 10800,
  color: '#8FA7EC'
},
{
  max: 18000,
  color: '#657FC1'
},
{
  max: 25200,
  color: '#3A5997'
},
{
  max: 27000,
  color: '#00366F'
}];
type UserMonthlyData = UserBaseDataForTimeSheet & { total: string; dailyData: DailyData[] }

/**
 * @description Timesheets admin panel funtion to return monthly timesheets of users.
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { date } = event.pathParameters;

    /**
     * For time being supposing admin user object until login credentials are finalized.
     */
    const requestingUser = new UserModel({
      id: 'adminId',
      user_id: 'Admin',
      real_name: 'Admin',
      tz: 'Asia/Karachi'
    });

    const dateParsed = moment(date, 'YYYY-MM', true).tz(requestingUser.tz);

    if (!dateParsed.isValid()) {
      throw new BadRequestError('Please select correct month in format YYYY-MM');
    }

    const mStart = dateParsed.startOf('month').unix();
    const mEnd = dateParsed.endOf('month').unix();

    /**
     * Get all users, and get all attendance for each user
     */
    const allUsers = await UserModel.scan().all().exec();
    const userMonthlyData: Array<UserMonthlyData> = await Promise.all(allUsers.map(async (user) => {
      // const query = {
      //   team_id: user.team_id,
      //   user_id: user.user_id,
      //   date: {
      //     $gte: mStart,
      //     $lte: mEnd
      //   }
      // };
      const attendances: AttendanceDocument[] = await AttendanceModel
        .scan()
        .where('team_id').eq(user.team_id)
        .and()
        .where('user_id')
        .eq(user.user_id)
        .and()
        .where('date')
        .between(mStart, mEnd)
        .all()
        .exec();

      let total = 0;
      const dailyData: Array<DailyData> = [];

      for (const currentDate = moment(mStart * 1000).tz(requestingUser.tz);
        currentDate.isBefore(moment(mEnd * 1000).tz(requestingUser.tz));
        currentDate.add(1, 'days')) {
        const dailyStartTime = moment(currentDate.unix() * 1000).tz(requestingUser.tz).startOf('day').unix();
        const dailyEndingTime = moment(currentDate.unix() * 1000).tz(requestingUser.tz).endOf('day').unix();

        const currentDateData = attendances.find((attendance) => attendance.date >= dailyStartTime && attendance.date <= dailyEndingTime);

        /**
         * Sum of all sessions durations
         * Session without out_stamp will be replaced with end of day.
         */
        const dailyTotalH = (currentDateData && currentDateData.sessions.reduce(
          (a, b) => {
            let outTime = b.out_stamp;
            if (!outTime) {
              const dayEndOutTime = moment(currentDateData.date * 1000).tz(user.tz).endOf('day').unix();
              // Checking if it's not today
              if (moment().tz(user.tz).endOf('day').unix() !== dayEndOutTime) {
                outTime = moment(currentDateData.date * 1000).tz(user.tz).endOf('day').unix();
              } else {
                outTime = moment().unix();
              }
            }
            return a + (outTime - b.in_stamp);
          }, 0
        )) || 0;
        total += dailyTotalH;
        const time = convertSecondToHHMM(dailyTotalH);

        /**
         * @example message = '02:00 hour on Wednesday October 28'
         */
        const message = `${time} hour on ${currentDate.format(
          'dddd'
        )} ${currentDate.format('MMMM')} ${currentDate.date()}`;

        let hexColor = '#E7E7E7';
        colorData.forEach((data) => {
          if (dailyTotalH > data.max) hexColor = data.color;
        });
        dailyData.push({
          hexColor,
          time,
          date: currentDate.format('YYYY-MM-DD'),
          message
        });
      }

      const userBaseData = extractUserBaseData(user);
      /**
       * Using hardcoded image URL temporarily
       */
      return {
        ...userBaseData,
        total: convertSecondToHHMM(total),
        dailyData
      };
    }));

    return new APIResponse().success('OK', { userMonthlyData });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};
