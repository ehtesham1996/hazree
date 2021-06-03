import { helpMarkDown } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { chatPostMessage } from '../../slack/api';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function help(com: UserCommand, _user: UsersDocument): Promise<void> {
  await chatPostMessage(com.channelId, helpMarkDown());
}
