import {
  markDownMessage,
  teamAlreadyExists,
  teamCreateFailMessage,
  teamCreateMessage
} from '@src/bot/slack/templates';
import { HttpError, UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { checkTeamService, addNewTeam } from '@src/services';

export async function teamCreate(com: UserCommand, user: UsersDocument): Promise<Array<any>> {
  try {
    const { parameters } = com;
    const teamName = parameters.slice(1, parameters.length).join(' ');

    const userUUID = user.user_id;
    const teamExists = await checkTeamService(userUUID, teamName);

    if (!teamExists) {
      const newTm = await addNewTeam(teamName, userUUID);
      return teamCreateMessage(newTm.name);
    }
    return teamAlreadyExists(teamName);
  } catch (error) {
    console.log('Error TM Create: ', error.message);
    if (error instanceof HttpError) {
      return markDownMessage(error.message);
    }
    return teamCreateFailMessage();
  }
}
