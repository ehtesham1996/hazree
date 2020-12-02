import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UserDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { monthlyTimesheetTemplate } from '../../../slack/templates';

// get the attendance of whole month, @timesheet 2020 06
export const getAttendanceByMonth = async (com: UserCommand, user: UserDocument): Promise<Array<any>> => {
  const { parameters } = com;
  const year = Number(parameters[0]);
  const month = parameters.length === 2 ? Number(parameters[1]) - 1 : moment().month();
  const queryDate = new Date(year, month, 1, 0, 0, 0, 0);

  const startTimestamp = moment(queryDate).tz(user.tz);
  const endTimestamp = moment().tz(user.tz);

  const query = {
    team_id: com.teamId,
    user_id: com.userId,
    date: { $gte: startTimestamp.unix(), $lte: endTimestamp.unix() }
  };
  const allAttendanceData: Array<AttendanceDocument> = await AttendanceModel
    .scan()
    .where('team_id').eq(com.teamId)
    .and()
    .where('user_id')
    .eq(com.userId)
    .and()
    .where('date')
    .between(startTimestamp.unix(), endTimestamp.unix())
    .all()
    .exec()
    ?? [new AttendanceModel({ ...query, sessions: [] })];

  const monthlyTimesheet: Array<any> = [];

  allAttendanceData.forEach((attendance) => {
    const workSessions = attendance.sessions.filter((s) => s.ses_type === 'work');

    const firstSession = workSessions[0];
    const lastSession = workSessions[workSessions.length - 1];

    // if user fogot to put out command in last session of day, if same day then current time is out_stamp otherwise 11:59:00 is out_stamp
    if (lastSession && moment(lastSession.in_stamp * 1000).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')) {
      lastSession.out_stamp = endTimestamp.unix();
    } else if (lastSession) {
      lastSession.out_stamp = moment(lastSession.in_stamp * 1000).endOf('day').unix();
    }

    const totalHours = attendance.sessions.reduce((acc, curr) => {
      const hours = (curr.out_stamp - curr.in_stamp);
      return acc + hours;
    }, 0);

    const timesheetObject = monthlyTimesheetTemplate({
      date: moment(firstSession.in_stamp * 1000).format('YYYY/MM/DD'),
      inTime: moment(firstSession.in_stamp * 1000).format('HH:mm:ss'),
      outTime: moment(lastSession.out_stamp * 1000).format('HH:mm:ss'),
      totalHours
    });

    Array.prototype.push.apply(monthlyTimesheet, timesheetObject);
  });

  return (monthlyTimesheet);
};
