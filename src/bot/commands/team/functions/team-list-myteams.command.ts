import { teamListSuccessMessage, teamNoListMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import * as teamService from '@src/services/team.service';

export async function teamListMyTeams(_com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    /**
     * Calling team list service here
     */
    const teams = await teamService.getUserTeams(user.user_id, false, false);

    const teamList = [];
    teams.forEach((team) => teamList.push(team.name));
    if (teamList.length > 0) {
      /**
       * Returning teams response
       */
      return teamListSuccessMessage(teamList);
    }
    return teamNoListMessage();
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamNoListMessage();
  }
}
