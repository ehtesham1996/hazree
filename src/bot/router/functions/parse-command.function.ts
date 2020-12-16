import {
  string, type, assert
} from 'superstruct';
import { UserCommand } from '@src/core';

const SlackCommand = type({
  token: string(),
  team_id: string(),
  team_domain: string(),
  channel_id: string(),
  channel_name: string(),
  user_id: string(),
  user_name: string(),
  command: string(),
  text: string(),
  response_url: string(),
  trigger_id: string()
});

export function parseCommand({ body }: { body: any}): UserCommand {
  assert(body, SlackCommand);
  const [command, ...parameters] = body.text.split(' ');
  return ({
    teamId: body.team_id,
    userId: body.user_id,
    channelId: body.channel_id,
    command,
    parameters
  });
}
