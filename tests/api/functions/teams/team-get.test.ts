import { APIGatewayAuthenticatedEvent, APIResponse } from '@src/core';
import * as teamService from '@src/services/team.service';
import { GetTeams } from '@src/api/functions/teams/team-get';
import { TeamModel, UsersModel } from '@src/database';

describe('teams ==> GetTeams Lambda function test', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return statusCode 404 if no teams found', async () => {
    jest.spyOn(teamService, 'getUserTeams').mockImplementation(async () => []);

    const mockUser = new UsersModel({
      user_id: 'mockUserId',
      name: '',
      email: '',
      profile_picture: '',
      slack_data: {
        slack_user_id: ''
      }
    });
    const payload = {} as APIGatewayAuthenticatedEvent;
    payload.user = mockUser;

    const expected = new APIResponse().error(404, 'No teams found');
    const actual = await GetTeams(payload, null, () => null);
    expect(actual).toStrictEqual(expected);
  });

  it('should return team with statusCode 200 if teams found', async () => {
    jest.spyOn(teamService, 'getUserTeams').mockImplementation(async () => {
      const team1 = new TeamModel({ id: 'teamId1', name: 'teamName1' });
      const team2 = new TeamModel({ id: 'teamId2', name: 'teamName2' });
      return [team1, team2];
    });

    const mockUser = new UsersModel({
      user_id: 'mockUserId',
      name: '',
      email: '',
      profile_picture: '',
      slack_data: {
        slack_user_id: ''
      }
    });
    const payload = {} as APIGatewayAuthenticatedEvent;
    payload.user = mockUser;

    const expected = new APIResponse().success('2 team(s) found', {
      teams: [{
        teamId: 'teamId1',
        teamName: 'teamName1'
      }, {
        teamId: 'teamId2',
        teamName: 'teamName2'
      }
      ]
    });

    const actual = await GetTeams(payload, null, () => null);
    expect(actual).toStrictEqual(expected);
  });

  it('should throw an error when calling user is not given', async () => {
    jest.spyOn(teamService, 'getUserTeams').mockImplementation(async () => null);

    const payload = {} as APIGatewayAuthenticatedEvent;
    payload.user = null;

    const actual = await GetTeams(payload, null, () => null);
    const expected = new APIResponse().error(500, 'Something went wrong');
    expect(actual).toStrictEqual(expected);
  });
});
