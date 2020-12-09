// import { userInfo } from '@src/bot/slack/api';

import { teamUserAddFailMessage, teamUserAddSuccessMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { checkTeamService, addBulkMembersService } from '@src/services';

export async function teamAddMentionedMember(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.filter((item, index) => index !== 0 && !item.startsWith('<@') && !item.endsWith('>')).join(' ');
    const userUUID = user.user_id;
    const teamExists = await checkTeamService(userUUID, teamName);

    if (teamExists) {
      const userIds = parameters.filter((item) => item.startsWith('<@') && item.endsWith('>'));

      /**
       * addBulkMembersService service will go here.
       */

      const usersEmails = [];
      await addBulkMembersService(userUUID, teamName, usersEmails);
      /**
       * End.
       */

      return teamUserAddSuccessMessage(teamName, userIds);
    }
    return teamUserAddFailMessage(`Cannot find team \`${teamName}\`, it does not exist or you do not have permission!`);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamUserAddFailMessage();
  }
}
