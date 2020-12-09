import { allUsersInfo } from '@src/bot/slack/api/all-user-info.api';
import { teamInvalidParameters } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { chatPostMessage } from '../../slack/api';
import { teamAddAll, teamCreate } from './functions';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function team(com: UserCommand, user: UsersDocument): Promise<void> {
  const { parameters } = com;
  let teamResp: Array<any> = [];

  if (parameters.length >= 2 && parameters[0] === 'create') {
    /**
     * Parameters must contain ['sub command', 'name']
     * eg: ['create', 'Name']
    */
    teamResp = await teamCreate(com, user);
  } else if (parameters.length >= 3 && parameters[0] === 'add' && parameters[parameters.length - 1] === '@all') {
    /**
     * Parameters must contain ['add', 'name', '@all']
     * eg1: ['add', 'NameOfTeam', '@all']
     * eg2: ['add', 'Name', 'Of', 'Team', '@all']
    */
    teamResp = await teamAddAll(com, user);
  } else {
    teamResp = teamInvalidParameters();
  }

  await chatPostMessage(com.channelId, teamResp);
}
