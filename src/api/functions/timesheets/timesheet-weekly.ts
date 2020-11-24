import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult
} from 'aws-lambda';
import {
  APIResponse, BadRequestError, convertSecondToHHMM, extractUserBaseData, UserBaseData
} from '@src/core';
import moment from 'moment-timezone';
import { AttendanceModel, UserModel } from '@src/database';

interface WeekDays {
  saturday: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

type UserWeeklyData = UserBaseData & { total: string } & WeekDays;

/**
 * @description Timesheets admin panel funtion to return monthly timesheets of users.
 */
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { isoWeekYear = null, isoWeekNumber = null } = event.queryStringParameters || {};

    /**
     * For time being supposing admin user object until login credentials are finalized.
     */
    const requestingUser = new UserModel({
      id: 'adminId',
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

    /**
     * Get all users, and get all attendance for each user
     */
    const allUsers = await UserModel.scan().all().exec();
    const usersWeeklyData: Array<UserWeeklyData> = await Promise.all(allUsers.map(async (user) => {
      // const query = {
      //   team_id: user.team_id,
      //   user_id: user.user_id,
      //   date: {
      //     $gte: wStart,
      //     $lte: wEnd
      //   }
      // };
      const attendances = await AttendanceModel
        .scan()
        .where('team_id').eq(user.team_id)
        .and()
        .where('user_id')
        .eq(user.user_id)
        .and()
        .where('date')
        .between(wStart, wEnd)
        .all()
        .exec();

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
