import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UsersDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { userInfo } from '@src/bot/slack/api';
import { markDownMessage, monthlyTimesheetTemplate } from '../../../slack/templates';

// get the attendance of whole month, @timesheet 2020 06
export const getAttendanceByMonth = async (com: UserCommand, user: UsersDocument): Promise<Array<any> | null> => {
  /**
   * Getting time zone for user
   */
  const slackResponse = await userInfo(user.slack_data.slack_user_id);
  const { tz } = slackResponse.data.user;
  /** (End) getting time zone for user */

  const { parameters } = com;
  const year = Number(parameters[0]) || Number(moment().format('YYYY'));
  const month = parameters.length === 2 ? Number(parameters[1]) - 1 : moment().month();

  const stringYear = `${year}`;
  const stringMonth = (`0${month + 1}`).slice(-2);
  console.log(stringYear, stringMonth);

  const queryDate = moment.tz(`${stringYear}-${stringMonth}-01`, 'YYYY-MM-DD', true, tz);
  console.log(queryDate.format());

  if (!queryDate.isValid()) {
    return markDownMessage('>Sorry you have specified incorrect date');
  }
  const startTimestamp = queryDate.clone().startOf('month');
  const endTimestamp = queryDate.endOf('month');

  const allAttendanceData: AttendanceDocument[] = await AttendanceModel
    .query()
    .where('user_id')
    .eq(user.user_id)
    .and()
    .where('date')
    .between(startTimestamp.unix(), endTimestamp.unix())
    .all()
    .exec();

  if (allAttendanceData.length === 0) {
    return null;
  }

  const monthlyTimesheet: Array<any> = [];

  allAttendanceData.forEach((attendance) => {
    const workSessions = attendance.sessions.filter((s) => s.ses_type === 'work');

    const firstSession = workSessions[0];
    const lastSession = workSessions[workSessions.length - 1];

    // if user fogot to put out command in last session of day, if same day then current time is out_stamp otherwise 11:59:00 is out_stamp
    if (lastSession && lastSession.out_stamp === 0) {
      if (attendance.date === moment().tz(tz).startOf('day').unix()) {
        lastSession.out_stamp = moment().unix();
      } else {
        lastSession.out_stamp = moment(lastSession.in_stamp * 1000).tz(tz).endOf('day').unix();
      }
    }

    const totalHours = attendance.sessions.reduce((acc, curr) => {
      const hours = (curr.out_stamp - curr.in_stamp);
      return acc + hours;
    }, 0);

    const timesheetObject = monthlyTimesheetTemplate({
      date: moment(attendance.date * 1000).tz(tz).format('YYYY/MM/DD'),
      inTime: moment(firstSession.in_stamp * 1000).tz(tz).format('HH:mm'),
      outTime: moment(lastSession.out_stamp * 1000).tz(tz).format('HH:mm'),
      totalHours
    });

    Array.prototype.push.apply(monthlyTimesheet, timesheetObject);
  });

  return (monthlyTimesheet);
};
