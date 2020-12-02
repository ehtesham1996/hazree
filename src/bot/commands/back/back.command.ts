import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UserDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { chatPostMarkdown } from '../../slack/api';

export async function back(com: UserCommand, user: UserDocument): Promise<void> {
  const timestamp = moment().tz(user.tz);
  const date = timestamp.clone().startOf('day').unix();
  const attendance: AttendanceDocument = (await AttendanceModel
    .scan()
    .where('team_id').eq(com.teamId)
    .and()
    .where('user_id')
    .eq(com.userId)
    .and()
    .where('date')
    .eq(date)
    .all()
    .exec())[0]
    ?? new AttendanceModel({
      team_id: com.teamId, user_id: com.userId, date, sessions: []
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
    await chatPostMarkdown(com.userId, '>Welcome back :tada:');
    return;
  }
  await chatPostMarkdown(com.userId, '>You are already punched `in` :robot_face:');
}
