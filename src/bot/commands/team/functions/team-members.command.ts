import {
  markDownMessage,
  teamCreateFailMessage,
  teamMemberListMessage
} from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import * as teamService from '@src/services';

export async function teamListTeamMember(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length).join(' ');

    const userUUID = user.user_id;
    const teams = await teamService.getUserTeams(userUUID, true, false, teamName);
    const team = teams[0];

    if (!team) return markDownMessage(`>Sorry team with name \`${teamName}\` does not exists`);

    const teamMemberData = await teamService.getTeamMembers(team.id);

    const { members, teamData } = teamMemberData;

    return teamMemberListMessage(members, teamData.pending_invites);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamCreateFailMessage();
  }
}
