import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UserDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { chatPostMarkdown } from '../../slack/api';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function brb(com: UserCommand, user: UserDocument): Promise<void> {
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
