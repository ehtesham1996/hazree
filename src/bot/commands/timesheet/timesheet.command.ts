import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { chatPostMarkdown, chatPostMessage } from '../../slack/api';
import { getAttendanceByDay, getAttendanceByMonth } from './functions/index';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function timesheet(com: UserCommand, user: UsersDocument): Promise<void> {
  const { parameters } = com;
  let attendance: Array<any> = [];
  if (parameters.length === 1 || parameters.length === 2) {
    attendance = await getAttendanceByMonth(com, user);
  } else if (parameters.length === 3 || parameters.length === 0) {
    attendance = await getAttendanceByDay(com, user);
  }

  if (!attendance) {
    await chatPostMarkdown(com.userId, '>Sorry you have no attendance history for specified date');
  } else {
    await chatPostMessage(com.userId, attendance);
  }
}
