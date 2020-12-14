import {
  APIGatewayAuthenticatedHandler,
  APIResponse,
  BadRequestError,
  HttpAlreadyExistsError
} from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';
import { TeamDocument } from '@src/database';

/**
 * @description A simple get teams lambda function that is called when
 *              /team endpoint is called with headers to get teams of
 *              which user is member or admin
 */
const PostTeam: APIGatewayAuthenticatedHandler = async (event) => {
  try {
    const {
      user_id: userId = ''
    } = event.user;

    const payload = JSON.parse(event.body);
    console.log('Paylaod ===> ', payload);
    const { teamName = '' } = payload;
    if (!teamName) throw new BadRequestError('Please specify the team name');

    const teamExists = await teamService.getUserTeams(userId, false, true, teamName);
    if (teamExists) throw new HttpAlreadyExistsError(`A team with name ${teamName} already exists`);

    const teamData: TeamDocument = await teamService.addNewTeam(teamName, userId);
    return new APIResponse()
      .success(`Team ${teamName} created succesfully`, {
        teamId: teamData.id,
        teamName: teamData.name
      });
  } catch (error) {
    return new APIResponse().error(error.statusCode, error.message);
  }
};

export const handler = middy(PostTeam).use(authorize());
