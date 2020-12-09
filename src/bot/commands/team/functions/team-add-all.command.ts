import { allUsersInfo } from '@src/bot/slack/api/all-user-info.api';
import { teamUserAddFailMessage, teamUserAddSuccessMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UserDocument } from '@src/database/models';
import { checkTeamService, addNewTeamService, addBulkMembersService } from '@src/services';

export async function teamAddAll(com: UserCommand, user: UserDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length - 1).join(' ');
    console.log('teamName', teamName);
    /**
     * TEMPORARY
     * Change it to user.user_id after user model update
     */

    const userUUID = user.id;
    const teamExists = await checkTeamService(userUUID, teamName);
    console.log('teamExists', teamExists);

    if (teamExists) {
      const allUsers = await allUsersInfo();
      const usersEmails = allUsers.data.members.map((item) => item.profile.email);
      await addBulkMembersService(userUUID, teamName, usersEmails);
      const userNames = allUsers.data.members.map((item) => item.real_name);
      return teamUserAddSuccessMessage(teamName, userNames);
    }
    return teamUserAddFailMessage(`Cannot find team \`${teamName}\`, it does not exist or you do not have permission!`);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamUserAddFailMessage();
  }
}