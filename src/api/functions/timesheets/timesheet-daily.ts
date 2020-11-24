import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';
import {
  UserModel, AttendanceModel, UserDocument, AttendanceDocument
} from '@src/database';
import { BadRequestError } from '@src/core/errors';
import { APIResponse, UserBaseDataForTimeSheet } from '@src/core/types';
import moment from 'moment-timezone';
import 'source-map-support/register';
import { convertSecondToHHMM } from '@src/core';
import { extractUserBaseData } from './user-data-timesheet';

interface Session {
  inTime: number;
  outTime: number;
  comments: string;
  duration: number;
  displayDuration: string;
}

type UserDailyData = UserBaseDataForTimeSheet & { total: string; sessions: Session[] }

/**
* @description Timesheet function to return daily timesheet of all users in the
*              work space
*/
export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  try {
    console.log('Payload is ==>', event.pathParameters);
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

    const parsedDate = moment(date, 'YYYY-MM-DD').tz(requestingUser.tz);
    console.log(parsedDate.toISOString());

    if (!parsedDate.isValid()) {
      throw new BadRequestError('Please select valid date in format YYYY-MM-DD');
    }

    // Getting all employes from database with projection of their name
    // eslint-disable-next-line @typescript-eslint/camelcase
    const allUsers: UserDocument[] = await UserModel.scan().all().exec();

    const startDate = parsedDate.startOf('day').unix();
    const endDate = parsedDate.endOf('day').unix();

    let minStartingTime = 0;
    let maxEndingTime = 0;

    const usersDailyData: UserDailyData[] = await Promise.all(allUsers.map(async (user) => {
      const userBaseData = extractUserBaseData(user);
      const userAttendanceData: UserDailyData = {
        ...userBaseData,
        total: '',
        sessions: []
      };

      // const query = {
      //   team_id: user.team_id,
      //   user_id: user.user_id,
      //   date: {
      //     $gte: startDate,
      //     $lte: endDate
      //   }
      // };
      const attendance: AttendanceDocument = (await AttendanceModel
        .scan()
        .where('team_id').eq(user.team_id)
        .and()
        .where('user_id')
        .eq(user.user_id)
        .and()
        .where('date')
        .between(startDate, endDate)
        .all()
        .exec())[0];

      let totalTime = 0;
      userAttendanceData.sessions = (attendance && attendance.sessions.map((session) => {
        const inTime = session.in_stamp;
        let outTime = session.out_stamp;
        const comments = session.comment;
        if (!outTime) {
          const dayEndOutTime = moment(attendance.date * 1000).tz(user.tz).endOf('day').unix();
          // Checking if it's not today
          if (moment().tz(user.tz).endOf('day').unix() !== dayEndOutTime) {
            outTime = moment(attendance.date * 1000).tz(user.tz).endOf('day').unix();
          } else {
            outTime = moment().unix();
          }
        }

        const duration = outTime - inTime;
        totalTime += duration;

        if (minStartingTime === 0 || inTime < minStartingTime) minStartingTime = inTime;
        if (maxEndingTime === 0 || outTime > maxEndingTime) maxEndingTime = outTime;

        minStartingTime = minStartingTime === 0 ? inTime : minStartingTime;
        return {
          inTime,
          outTime,
          comments,
          duration,
          displayDuration: convertSecondToHHMM(duration)
        };
      })) ?? [];

      userAttendanceData.total = convertSecondToHHMM(totalTime);
      return userAttendanceData;
    }));

    return new APIResponse()
      .success('Attendance data fetched successfully',
        {
          usersDailyData,
          minStartingTime,
          maxEndingTime
        });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};
