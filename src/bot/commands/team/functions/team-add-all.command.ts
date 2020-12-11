import { SlackUser, userInfo } from '@src/bot/slack/api';
import { channelMembers } from '@src/bot/slack/api/channels-members.api';
import { markDownMessage, teamUserAddFailMessage, teamUserAddSuccessMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import * as teamService from '@src/services/team.service';

export async function teamAddAll(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length - 1).join(' ');
    const userUUID = user.user_id;
    const teamExists = await teamService.getUserTeams(userUUID, true, true, teamName);

    if (teamExists) {
      const allChannelMemberResponse = await channelMembers(com.channelId);
      let {
        members: channelMemberIds = []
      } = allChannelMemberResponse.data;

      channelMemberIds = channelMemberIds.filter((mId) => mId !== com.userId);
      if (channelMemberIds.length === 0) {
        return markDownMessage('>Sorry the specified channels does not any members yet');
      }

      let allUsers: SlackUser[] = await Promise.all(channelMemberIds.map(async (channelMemberId) => {
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
      await teamService.addBulkMembersService(userUUID, teamName, usersEmails);
      const userNames = allUsers.map((item) => item.real_name || item.name);
      return teamUserAddSuccessMessage(teamName, userNames);
    }
    return teamUserAddFailMessage(`Cannot find team \`${teamName}\`, it does not exist or you do not have permission!`);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamUserAddFailMessage();
  }
}
