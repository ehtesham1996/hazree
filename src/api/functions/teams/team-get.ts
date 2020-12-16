import { APIGatewayAuthenticatedHandler, APIResponse } from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';

/**
 * @description A simple get teams lambda function that is called when
 *              /team endpoint is called with headers to get teams of
 *              which user is member or admin
 */
const GetTeams: APIGatewayAuthenticatedHandler = async (event) => {
  const {
    user_id: userId = ''
  } = event.user;

  const teams = await teamService.getUserTeams(userId, false, false);

  if (teams.length > 0) {
    const teamsData = teams.map((team) => ({
      teamId: team.id,
      teamName: team.name
    }));

    return new APIResponse()
      .success(`${teamsData.length} team(s) found`,
        {
          teams: teamsData
        });
  }

  return new APIResponse().error(404, 'No teams found');
};

export const handler = middy(GetTeams).use(authorize());
