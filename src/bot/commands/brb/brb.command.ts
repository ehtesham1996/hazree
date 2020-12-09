import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UsersDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { chatPostMarkdown, userInfo } from '../../slack/api';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function brb(com: UserCommand, user: UsersDocument): Promise<void> {
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
  await attendance.save();
  await chatPostMarkdown(com.userId, '>Use the `back` command once you are back');
}
