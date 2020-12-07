import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UsersDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { chatPostMessage, chatPostMarkdown, userInfo } from '../../slack/api';
import { punchOutMessage } from '../../slack/templates';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function punchOut(com: UserCommand, user: UsersDocument): Promise<void> {
  /**
   * Getting time zone for user
   */
  const slackResponse = await userInfo(user.slack_data.slack_user_id);
  const { tz } = slackResponse.data.user;
  /** (End) getting time zone for user */

  const teamId = ''; // For time being sending team id null
  const timestamp = moment().tz(tz);
  const date = timestamp.clone().startOf('day').unix();

  const attendance: AttendanceDocument = (await AttendanceModel
    .query()
    .where('user_id')
    .eq(user.user_id)
    .and()
    .where('date')
    .eq(date)
    .all()
    .exec())[0]
    ?? new AttendanceModel({
      team_id: teamId, user_id: user.user_id, date, sessions: []
    });

  const workSessions = attendance.sessions.filter((s) => s.ses_type === 'work');
  const currentSession = workSessions.find((s) => s.out_stamp === 0);
  if (!currentSession) {
    await chatPostMarkdown(com.userId, '>You are not punched `in` :robot_face:');
    return;
  }
  currentSession.out_stamp = timestamp.unix();
  const sessionCount = attendance.sessions.length;
  const totalHours = attendance.sessions.reduce((acc, curr) => {
    const hours = (curr.out_stamp - curr.in_stamp);
    return acc + hours;
  }, 0);
  const lastSessionDuration = (currentSession.out_stamp - currentSession.in_stamp);
  await attendance.save();
  await chatPostMessage(com.userId,
    punchOutMessage({
      inTime: moment(workSessions[0].in_stamp * 1000).tz(tz).format('DD-MM-YYYY HH:mm:ss'),
      outTime: moment(currentSession.out_stamp * 1000).tz(tz).format('DD-MM-YYYY HH:mm:ss'),
      sessionCount,
      totalHours,
      lastSessionDuration
    }));
}
