import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UserDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import { chatPostMessage, chatPostMarkdown } from '../../slack/api';
import { punchOutMessage } from '../../slack/templates';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function punchOut(com: UserCommand, user: UserDocument): Promise<void> {
  const timestamp = moment().tz(user.tz);
  const date = timestamp.clone().startOf('day').unix();

  const attendance: AttendanceDocument = (await AttendanceModel
    .scan()
    .where('team_id')
    .eq(com.teamId)
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
  const sessionCount = attendance.sessions.length;
  const totalHours = attendance.sessions.reduce((acc, curr) => {
    const hours = (curr.out_stamp - curr.in_stamp);
    return acc + hours;
  }, 0);
  const lastSessionDuration = (currentSession.out_stamp - currentSession.in_stamp);
  await attendance.save();
  await chatPostMessage(com.userId,
    punchOutMessage({
      inTime: moment(currentSession.in_stamp * 1000).format('DD-MM-YYYY HH:mm:ss'),
      outTime: moment(currentSession.out_stamp * 1000).format('DD-MM-YYYY HH:mm:ss'),
      sessionCount,
      totalHours,
      lastSessionDuration
    }));
}
