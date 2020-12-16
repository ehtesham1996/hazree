import { UserCommand } from '@src/core';
import { Users } from '@src/database';
import { chatPostMarkdown } from '../../slack/api';

const qoutes = [
  'One day i will understand you, and then i will hunt you down',
  'bas kar do',
  'now that not very smart ',
  'i guess you are out of funny things to say',
  'dont know',
  'sorry say again',
  'better luck next time',
  'how very sad ',
  'soo true',
  'sorry for that',
  'meray pass tum ho :heart: ',
  'wah gee wah',
  'phir kabhi',
  'dosari command try karain'
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function randomResponse(command: UserCommand, _user: Users | null): Promise<void> {
  const index = Math.floor(Math.random() * qoutes.length);
  const result = await chatPostMarkdown(command.channelId, qoutes[index]);
  console.log('Random response result ', JSON.stringify(result));
}
