import moment from 'moment-timezone';
import { UserCommand } from '@src/core';
import { UsersDocument, AttendanceModel, AttendanceDocument } from '@src/database/models';
import {
  chatPostMarkdown, chatPostMessage, reminderInfo, userInfo
} from '../../slack/api';
import {
  brbInvalidReminder
} from '../../slack/templates';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function brb(com: UserCommand, user: UsersDocument): Promise<void> {
  /**
   * Getting time zone for user
   */
  const slackResponse = await userInfo(user.slack_data.slack_user_id);
  const { tz } = slackResponse.data.user;
  /** (End) getting time zone for user */

  // const teamId = ''; // For time being sending team id null
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
    .exec())[0];

  if (!attendance) {
    await chatPostMarkdown(com.userId, '>You are not punched `in` for today :robot_face:');
    return;
  }

  const workSessions = attendance.sessions.filter((s) => s.ses_type === 'work');
  const currentSession = workSessions.find((s) => s.out_stamp === 0);
  if (!currentSession) {
    await chatPostMarkdown(com.userId, '>Already on `brb`. Use `back` command once you\'re back.');
    return;
  }
  currentSession.out_stamp = timestamp.unix();

  /**
   * Adding Reminder if user mentioned any time
   */
  const remindTime = com.parameters.join(' ').toString();
  if (remindTime) {
    const reminderResponse = await reminderInfo(
      "Reminder : You're break period has ended :robot_face:",
      remindTime,
      com.userId
    );
    console.log(reminderResponse.data);

    if (!reminderResponse.data.ok) {
      if (reminderResponse.data.error && reminderResponse.data.error === 'cannot_parse') {
        await chatPostMessage(com.channelId, brbInvalidReminder());
      } else {
        await chatPostMarkdown(com.userId, '>Oops some thing is wrong :robot_face:');
        console.log(com.userId);
      }
      return;
    }
  }

  await attendance.save();
  await chatPostMarkdown(com.userId, '>Use the `back` command once you are back');
}
