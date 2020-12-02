import {
  string, number, optional, type, assert
} from 'superstruct';
import { UserCommand } from '@src/core';

const Event = type({
  client_msg_id: string(),
  type: string(),
  text: string(),
  user: string(),
  ts: string(),
  team: string(),
  channel: string(),
  event_ts: string(),
  channel_type: optional(string())
});

const SlackMessage = type({
  token: string(),
  team_id: string(),
  api_app_id: string(),
  event: Event,
  type: string(),
  event_id: string(),
  event_time: number()
  // authed_users: array(string()) || undefined
});

export function parseEvent({ body }: { body: any}): UserCommand {
  assert(body, SlackMessage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [botuuid, command, ...parameters] = body.event.text.split(' ');
  return ({
    teamId: body.team_id,
    userId: body.event.user,
    channelId: body.event.channel,
    command: command?.toLocaleLowerCase(),
    parameters
  });
}
