import {
  markDownMessage,
  teamUserRemoveFailMessage
} from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { checkTeamService } from '@src/services';

export async function teamRemoveMember(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.filter((item, index) => index !== 0 && !item.startsWith('<@') && !item.endsWith('>')).join(' ');
    const userUUID = user.user_id;
    const teamExists = await checkTeamService(userUUID, teamName);

    if (teamExists) {
      // const userIds = parameters.filter((item) => item.startsWith('<@') && item.endsWith('>'));

      /**
       * Remove team member service will go here.
       */
      return markDownMessage('>Feature in development. For time being you can use portal to remove user');
      // return teamUserRemoveSuccessMessage(teamName, userIds);
    }
    return teamUserRemoveFailMessage(`Cannot find team \`${teamName}\`, it does not exist or you do not have permission!`);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamUserRemoveFailMessage();
  }
}
