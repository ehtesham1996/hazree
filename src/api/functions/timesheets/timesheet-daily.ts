import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import { UserModel, AttendanceModel, connectToDatabase } from '@src/database';
import { BadRequestError } from '@src/core/errors';
import { APIResponse } from '@src/core/types';
import moment from 'moment-timezone';
import 'source-map-support/register';
import { convertSecondToHHMM } from '@src/core';

/**
* @description Timesheet function to return daily timesheet of all users in the
*              work space
*/
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context) => {
  try {
    console.log('Payload is ==>', event.pathParameters);
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

    const parsedDate = moment(date, 'YYYY-MM-DD', requestingUser.tz, true);

    if (!parsedDate.isValid()) {
      throw new BadRequestError('Please select valid date in format YYYY-MM-DD');
    }

    await connectToDatabase(context);

    // Getting all employes from database with projection of their name
    // eslint-disable-next-line @typescript-eslint/camelcase
    const allUsers = await UserModel.find();

    const startDate = parsedDate.startOf('day').unix();
    const endDate = parsedDate.endOf('day').unix();

    const usersDailyData = await Promise.all(allUsers.map(async (user) => {
      const userAttendanceData = {
        name: user.real_name,
        userId: user._id,
        // For time being sending static avatar
        imageUrl: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
        total: '',
        sessions: []
      };

      const query = {
        team_id: user.team_id,
        user_id: user.user_id,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
      const attendance = await AttendanceModel.findOne(query);

      let totalTime = 0;
      userAttendanceData.sessions = attendance.sessions.map((session) => {
        const duration = session.out_stamp - session.in_stamp;
        totalTime += duration;

        return {
          inTime: session.in_stamp,
          outTime: session.out_stamp,
          comments: session.comment,
          duration
        };
      });

      userAttendanceData.total = convertSecondToHHMM(totalTime);
      return userAttendanceData;
    }));

    return new APIResponse().success('Attendance data fetched successfully', { usersDailyData });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};
