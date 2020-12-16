// import { userInfo } from '@src/bot/slack/api';

import { SlackUser, userInfo } from '@src/bot/slack/api';
import { markDownMessage, teamUserAddFailMessage, teamUserAddSuccessMessage } from '@src/bot/slack/templates';
import { BadRequestError, HttpError, UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import * as teamService from '@src/services/team.service';

export async function teamAddMentionedMember(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.filter((item, index) => index !== 0 && !item.startsWith('<@') && !item.endsWith('>')).join(' ');
    const userUUID = user.user_id;
    const teamExists = await teamService.getUserTeams(userUUID, true, true, teamName);

    if (teamExists) {
      let userIds = parameters.filter((item) => item.startsWith('<@') && item.endsWith('>'));
      userIds = userIds.map((slackUserId) => slackUserId.replace('<@', '').replace('>', ''));
      console.log('userIds are ', userIds);

      let allUsers: SlackUser[] = await Promise.all(userIds.map(async (channelMemberId) => {
        const slackUserData = await userInfo(channelMemberId);
        if (slackUserData.data.ok) {
          return slackUserData.data.user;
        }
        return null;
      }));
      allUsers = allUsers.filter((channelUser) => channelUser && channelUser.profile && channelUser.profile.email);

      if (allUsers.length === 0) {
        return markDownMessage('Sorry no valid users found in channel');
      }
      const usersEmails = allUsers.map((channelUser) => channelUser.profile.email);
      /**
       * addBulkMembersService service will go here.
       */
      const addedEmails = await teamService.addBulkMembersService(userUUID, teamName, usersEmails, null, user.email);
      /**
       * End.
       */

      const addedUserIds = allUsers
        .map((channelUser) => (addedEmails.includes(channelUser.profile.email) ? channelUser.id : null))
        .filter((channelUser) => channelUser);

      return teamUserAddSuccessMessage(teamName, addedUserIds);
    }
    return teamUserAddFailMessage(`Cannot find team \`${teamName}\`, it does not exist or you do not have permission!`);
  } catch (error) {
    console.log('Error TM Create: ', error.message);

    if (error instanceof HttpError || error instanceof BadRequestError) {
      return teamUserAddFailMessage(error.message);
    }

    return teamUserAddFailMessage();
  }
}
