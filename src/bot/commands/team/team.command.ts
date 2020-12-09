import { teamInvalidParameters } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { chatPostMessage } from '../../slack/api';
import {
  teamAddAll, teamCreate, teamAddMentionedMember, teamListMyTeams
} from './functions';
import { teamRemoveMember } from './functions/team-remove-member.command';

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export async function team(com: UserCommand, user: UsersDocument): Promise<void> {
  const { parameters } = com;
  let teamResp: Array<any> = [];

  if (parameters.length >= 2 && parameters[0] === 'create') {
    /**
     * Team Create Command: Parameters must contain ['create', 'teamname']
     * eg: ['create', 'Name']
    */
    teamResp = await teamCreate(com, user);
  } else if (parameters.length >= 3
    && parameters[0] === 'add'
    && parameters[parameters.length - 1] === '@all') {
    /**
     * Team Add All Command: Parameters must contain ['add', 'teamname', '@all']
     * eg1: ['add', 'NameOfTeam', '@all']
     * eg2: ['add', 'Name', 'Of', 'Team', '@all']
    */
    teamResp = await teamAddAll(com, user);
  } else if (parameters.length >= 3 && parameters[0] === 'add' && parameters[parameters.length - 1].startsWith('<@') && parameters[parameters.length - 1].endsWith('>')) {
    /**
     * Team Add Mentioned Command: Parameters must contain ['add', 'teamname', '@member']
     * eg1: ['add', 'NameOfTeam', '@member1', '@member2']
     * eg2: ['add', 'Name', 'Of', 'Team', '@member1', '@member2']
    */
    teamResp = await teamAddMentionedMember(com, user);
  } else if (parameters.length >= 3 && parameters[0] === 'remove' && parameters[parameters.length - 1].startsWith('<@') && parameters[parameters.length - 1].endsWith('>')) {
    /**
     * Team Remove Command: Parameters must contain ['remove', 'teamname', '@member']
     * eg1: ['remove', 'NameOfTeam', '@member1', '@member2']
     * eg2: ['remove', 'Name', 'Of', 'Team', '@member1', '@member2']
    */
    teamResp = await teamRemoveMember(com, user);
  } else if (parameters.length === 1 && parameters[0] === 'list') {
    /**
     * Team List My Teams Command: Parameters must contain ['list']
     * eg1: ['list']
    */
    teamResp = await teamListMyTeams(com, user);
  } else {
    teamResp = teamInvalidParameters();
  }

  await chatPostMessage(com.channelId, teamResp);
}
