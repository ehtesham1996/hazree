import { teamListSuccessMessage, teamNoListMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';

export async function teamListMyTeams(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    console.log(com, user);
    /**
     * Add team list service here
     */
    const teamListNames = [];
    if (teamListNames.length > 0) {
      /**
       * Format to return team list
       */
      return teamListSuccessMessage(['Team 1', 'Team 2']);
    }
    return teamNoListMessage();
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamNoListMessage();
  }
}
