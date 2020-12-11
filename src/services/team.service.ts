import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import {
  TeamModel,
  TeamDocument,
  UsersDocument,
  UsersModel
} from '@src/database/models';
import dynamoose from 'dynamoose';
import { BadRequestError, HttpError } from '@src/core';
import * as emailService from './email.service';

export async function addNewTeam(teamName: string, userId: string): Promise<TeamDocument> {
  const newItem = {
    id: uuidv4(),
    name: teamName,
    created_by: userId,
    created_date: moment().unix(),
    admins: [userId],
    members: [],
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

export async function getUserTeams<B extends boolean>(
  userId: string,
  adminOnly?: boolean,
  count?: B,
  teamName?: string
): Promise<B extends false ? TeamDocument[] : number>

export async function getUserTeams(
  userId: string,
  adminOnly = false,
  count = false,
  teamName?: string
): Promise<TeamDocument[] | number> {
  console.log('Payload GetUserTeams ==> ', userId);

  const baseQuery = new dynamoose.Condition()
    .where('admins').contains(userId);

  if (!adminOnly) {
    baseQuery.or().where('members').contains(userId);
  }

  const query = new dynamoose.Condition().parenthesis(baseQuery);
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

export async function getUserPendingTeam(
  userEmail: string
): Promise<TeamDocument[]> {
  console.log('Payload GetUserPendingTeams ==> ', userEmail);

  const result: TeamDocument[] = await TeamModel
    .scan()
    .where('pending_invites')
    .contains(userEmail)
    .all()
    .exec();
  return result;
}

export async function addBulkMembersService(
  userUUID: string,
  teamName: string,
  memberEmails: Array<string>,
  teamId?: string,
  userEmail?: string
): Promise<void> {
  let team: TeamDocument;
  if (teamId) {
    // eslint-disable-next-line prefer-destructuring
    team = (await TeamModel.query('id').eq(teamId).exec())[0];
  } else if (teamName) {
    // eslint-disable-next-line prefer-destructuring
    team = (await TeamModel
      .scan()
      .where('name').eq(teamName)
      .and()
      .where('admins')
      .contains(userUUID)
      .all()
      .exec())[0];
  }

  if (!team) {
    throw new BadRequestError('Sorry you specified invalid team');
  }

  if (!team.admins.includes(userUUID)) {
    throw new HttpError('Sorry you are not an admin of this team', 403);
  }

  if (memberEmails.includes(userEmail)) {
    throw new BadRequestError('You cannot invite yourself to team');
  }

  const newEmails = memberEmails.filter((email) => !team.pending_invites.find((pe) => pe === email));
  team.pending_invites.push(...newEmails);
  await team.save();

  /**
   * Now sending email to those members
   * that are not on hazree portal
   */
  const users: UsersModel[] = await UsersModel.scan('email').in(newEmails).all().exec();
  const notRegisterUserEmails = newEmails.filter((email) => !users.find((user) => user.email === email));
  await emailService.sendTeamJoinInvitation(team.name, notRegisterUserEmails);
}

export async function updateTeamInvitation(
  teamId: string,
  email: string,
  userId: string,
  join: boolean
): Promise<string> {
  const teamData = (await TeamModel.query('id').eq(teamId).exec())[0];
  if (!teamData) {
    throw new BadRequestError('Invalid team specified to join');
  }

  if (teamData.members.includes(userId)) {
    return 'Team already joined';
  }

  if (!teamData.pending_invites.includes(email)) {
    throw new BadRequestError('Sorry you are not invited to this team');
  }

  teamData.pending_invites = teamData.pending_invites.filter((invitedEmail) => invitedEmail !== email);

  if (join) {
    teamData.members.push(userId);
  }

  await teamData.save();

  if (join) {
    return 'Team invitation accepted successfully';
  }
  return 'Team invitation rejected';
}

export async function getTeamMembers(teamId: string, adminId?: string): Promise<{
  members: UsersDocument[];
  teamData: TeamDocument;
}> {
  const teamData = (await TeamModel.query('id').eq(teamId).exec())[0];
  if (!teamData) throw new BadRequestError('Invalid team specified');

  if (adminId && !teamData.admins.includes(adminId)) {
    throw new HttpError('Sorry you are not admin of this team', 403);
  }

  const memberIds = teamData.members;
  const members: UsersDocument[] = [];

  await Promise.all(memberIds.map(async (memberId) => {
    const memberData = (await UsersModel.query('user_id').eq(memberId).exec())[0];
    if (memberData) members.push(memberData);
  }));

  return { members, teamData };
}

export async function removeMember(adminId: string, teamId: string, memberId: string): Promise<void> {
  const teamData = (await TeamModel.query('id').eq(teamId).exec())[0];
  if (!teamData) throw new BadRequestError('Invalid team specified');

  if (adminId && !teamData.admins.includes(adminId)) {
    throw new HttpError('Sorry you are not admin of this team', 403);
  }

  if (!teamData.members.includes(memberId)) {
    throw new HttpError('Sorry the member specified is not part of this team', 404);
  }

  teamData.members = teamData.members.filter((mId) => mId !== memberId);
  await teamData.save();
}
