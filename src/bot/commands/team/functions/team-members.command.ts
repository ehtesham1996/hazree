import {
  markDownMessage,
  teamMemberListMessage
} from '@src/bot/slack/templates';
import { BadRequestError, HttpError, UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import * as teamService from '@src/services';

export async function teamListTeamMember(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length).join(' ');

    const userUUID = user.user_id;
    const teams = await teamService.getUserTeams(userUUID, false, false, teamName);
    const team = teams[0];

    if (!team) return markDownMessage(`>Sorry team with name \`${teamName}\` does not exists`);

    const teamMemberData = await teamService.getTeamMembers(team.id, userUUID);

    const { members, teamData } = teamMemberData;

    const pendingInvites = teamData.admins.includes(userUUID) ? teamData.pending_invites : [];
    return teamMemberListMessage(members, pendingInvites);
  } catch (error) {
    if (error instanceof HttpError || error instanceof BadRequestError) {
      return markDownMessage(error.message);
    }
    return markDownMessage('>Unable to list team members');
  }
}
