import { APIGatewayAuthenticatedHandler, APIResponse } from '@src/core';
import middy from 'middy';
import 'source-map-support/register';
import authorize from '@src/api/functions/auth/authorize.middleware';
import * as teamService from '@src/services/team.service';

/**
 * @description A simple get team/invitation lambda function that is called when
 *              /team/invitations endpoint is called with headers to get teams of
 *              which user is invited to
 */
const GetTeamInvitations: APIGatewayAuthenticatedHandler = async (event) => {
  const {
    email
  } = event.user;

  const teams = await teamService.getUserPendingTeam(email);

  const teamsData = teams.map((team) => ({
    teamId: team.id,
    teamName: team.name
  })) || [];

  return new APIResponse()
    .success(`${teamsData.length} team(s) invitation found`,
      {
        invitations: teamsData
      });
};

export const handler = middy(GetTeamInvitations).use(authorize());
