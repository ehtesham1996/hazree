import { teamAlreadyExists, teamCreateFailMessage, teamCreateMessage } from '@src/bot/slack/templates';
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { checkTeamService, addNewTeamService } from '@src/services';

export async function teamCreate(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length).join(' ');

    const userUUID = user.user_id;
    const teamExists = await checkTeamService(userUUID, teamName);

    if (!teamExists) {
      const newTm = await addNewTeamService(com, teamName, userUUID);
      return teamCreateMessage(newTm.name);
    }
    return teamAlreadyExists(teamName);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    return teamCreateFailMessage();
  }
}
