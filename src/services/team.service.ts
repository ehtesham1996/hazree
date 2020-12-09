import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import {
  TeamModel,
  TeamDocument
} from '@src/database/models';
import { UserCommand } from '@src/core';
import dynamoose from 'dynamoose';

export async function addNewTeamService(com: UserCommand, teamName: string, userUUID: string): Promise<TeamDocument> {
  const newItem = {
    id: uuidv4(),
    name: teamName,
    slack_team_id: com.teamId,
    created_by: userUUID,
    created_date: moment().unix(),
    admins: [userUUID],
    members: [userUUID],
    pending_invites: []
  };
  const tm = new TeamModel(newItem);

  try {
    await tm.save();
    return tm;
  } catch (error) {
    console.error(error.message);
  }

  return tm;
}

export async function checkTeamService(createdById: string, teamName: string): Promise<boolean> {
  const checkIfTeamExists: Array<TeamDocument> = await TeamModel
    .scan()
    .where('name').eq(teamName)
    .and()
    .where('created_by')
    .eq(createdById)
    .all()
    .exec();

  console.log('checkIfTeamExists', checkIfTeamExists);
  if (checkIfTeamExists[0]) {
    return true;
  }
  return false;
}

export async function getUserTeams(
  userId: string,
  adminOnly = false,
  count = false,
  teamName?: string
): Promise<TeamDocument[] | number> {
  console.log('Payload GetUserTeams ==> ', userId);

  const query = new dynamoose.Condition()
    .where('admins').contains(userId);

  if (!adminOnly) {
    query.or().where('members').contains(userId);
  }

  if (teamName) {
    query.and().where('name').eq(teamName);
  }

  let result: TeamDocument[] | number;
  if (count) {
    result = (await TeamModel.scan(query).all().count().exec()).count;
  } else {
    result = await TeamModel.scan(query).all().exec();
  }

  console.log('Get user teams result is ', result);
  return result;
}

export async function addBulkMembersService(userUUID: string, teamName: string, userEmails: Array<string>): Promise<TeamDocument> {
  const tm = await TeamModel
    .scan()
    .where('name').eq(teamName)
    .and()
    .where('admins')
    .eq(userUUID)
    .all()
    .exec();

  console.log('checkIfTeamExists', tm);
  /**
   * If team exists
   */
  if (tm[0]) {
    tm.members.push(...userEmails);
    await tm.save();
  }
  return tm;
}
