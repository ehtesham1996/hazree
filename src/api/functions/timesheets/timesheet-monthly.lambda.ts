import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult
} from 'aws-lambda';
import { APIResponse, BadRequestError, convertSecondToHHMM } from '@src/core';
import moment from 'moment-timezone';
import { AttendanceModel, connectToDatabase, UserModel } from '@src/database';

/**
 * @description Timesheets admin panel funtion to return monthly timesheets of users.
 */

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { date } = event.pathParameters;

    /**
     * For time being supposing admin user object until login credentials are finalized.
     */
    const requestingUser = new UserModel({
      _id: 'adminId',
      user_id: 'Admin',
      real_name: 'Admin',
      tz: 'Asia/Karachi'
    });

    const dateParsed = moment.utc(date, 'YYYY-MM', requestingUser.tz, true);
    if (!dateParsed.isValid()) {
      throw new BadRequestError();
    }

    await connectToDatabase(context);
    /**
     * Get all users, and get all attendance for each user
     */
    const allUsers = await UserModel.find();
    const userMonthlyData = await Promise.all(
      allUsers.map(async (user) => {
        const mStart = dateParsed.unix(),
          mEnd = moment(dateParsed).endOf('month').unix();
        const query = {
          team_id: user.team_id,
          user_id: user.user_id,
          date: {
            $gte: mStart,
            $lte: mEnd
          }
        };
        const attendanceModel = await AttendanceModel.find(query);
        let total = 0;
        const dailyData = attendanceModel.map((attend) => {
          const date = moment(attend.date * 1000).format('YYYY-MM-DD'),
            today = moment().tz(requestingUser.tz).format('YYYY-MM-DD');
          /**
           * @ignore Skip data for today.
           */
          if (today == date) {
            return {
              time: '00:00',
              date,
              message: `00:00 hour on ${moment(date).format('dddd')} ${moment(
                date
              ).format('MMMM')} ${moment(date).day()}`
            };
          }
          /**
           * Sum of all sessions durations
           * Session without out_stamp will be replaced with end of day.
           */
          const dailyTotalH = attend.sessions.reduce(
            (a, b) =>
              a +
              (b['out_stamp']
                ? b['out_stamp'] - b['in_stamp']
                : moment(moment(date).endOf('day')).unix() - b['in_stamp'] ||
                  0),
            0
          );

          total += dailyTotalH;
          const time = convertSecondToHHMM(dailyTotalH);

          /**
           * @example message = '02:00 hour on Wednesday October 28'
           */
          const message = `${time} hour on ${moment(date).format(
            'dddd'
          )} ${moment(date).format('MMMM')} ${moment(date).day()}`;

          return {
            time,
            date,
            message
          };
        });

        /**
         * Using hardcoded image URL temporarily
         */
        return {
          name: user.display_name,
          userId: user.user_id,
          imageUrl:
            'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
          total: convertSecondToHHMM(total),
          dailyData
        };
      })
    );

    if (date) return new APIResponse().success('OK', userMonthlyData);
  } catch (error) {
    if (error.statusCode == 400)
      return new APIResponse().error(error.statusCode, error.message);
    return new APIResponse().error();
  }
};
