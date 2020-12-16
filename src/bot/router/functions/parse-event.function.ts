/* eslint-disable @typescript-eslint/no-unused-vars */
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

export function parseEvent({ body }: { body: any }): UserCommand {
  assert(body, SlackMessage);
  console.log('Body text is', body.event.text);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line no-control-regex
  const [botuuid, command, ...parameters] = body.event.text.replace(/[^\x00-\x7F]/g, ' ').split(' ');
  return ({
    teamId: body.team_id,
    userId: body.event.user,
    channelId: body.event.channel,
    command: command?.toLocaleLowerCase(),
    parameters
  });
}
