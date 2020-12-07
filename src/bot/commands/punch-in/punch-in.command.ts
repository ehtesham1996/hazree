import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { AttendanceModel, AttendanceDocument, UsersDocument } from '@src/database/models';
import { chatPostMessage, userInfo } from '../../slack/api';
import { punchInMessage, markDownMessage } from '../../slack/templates';

export async function punchIn(com: UserCommand, user: UsersDocument): Promise<void> {
  /**
   * Getting time zone for user
   */
  const slackResponse = await userInfo(user.slack_data.slack_user_id);
  const { tz } = slackResponse.data.user;
  /** (End) getting time zone for user */

  const timestamp = moment().tz(tz);
  const date = timestamp.clone().startOf('day').unix();

  const teamId = ''; // For time being sending teamId as empty since
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
  const pendingSession = attendance.sessions.find((s) => s.out_stamp === 0);
  if (!pendingSession) {
    attendance.sessions.push({
      in_stamp: timestamp.unix(),
      out_stamp: 0,
      comment: '',
      ses_type: 'work'
    });
    await attendance.save();
    await chatPostMessage(com.userId, punchInMessage());
    return;
  }
  await chatPostMessage(com.userId,
    markDownMessage('>You are already punched `in` :robot_face:'));
}
