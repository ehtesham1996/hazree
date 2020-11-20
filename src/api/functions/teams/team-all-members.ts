import {
	APIGatewayProxyHandler,
	APIGatewayEvent,
	Context,
	APIGatewayProxyResult,
} from 'aws-lambda';
import {
	APIResponse,
	BadRequestError,
	timeSince,
	UserBaseDataForTeam,
} from '@src/core';
import moment from 'moment-timezone';
import { AttendanceModel, connectToDatabase, UserModel } from '@src/database';
import { extractUserBaseData } from './user-data-teams';
import * as Color from './team-color.json';

type teamAllMemebers = UserBaseDataForTeam & {
	lastActivity: string;
	activitySince: string;
	activityDate: string;
	time: string;
	color: string;
};

/**
 * @description Admin portal, Get all members of a team.
 */
export const handler: APIGatewayProxyHandler = async (
	event: APIGatewayEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	try {
		/**
		 * For time being supposing admin user object until login credentials are finalized.
		 */
		const requestingUser = new UserModel({
			_id: 'adminId',
			user_id: 'Admin',
			real_name: 'Admin',
			tz: 'Asia/Karachi',
		});

		await connectToDatabase(context);
		/**
		 * Get all users.
		 */
		const allUsers = await UserModel.find();

		const teamAllMemebers: Array<teamAllMemebers> = await Promise.all(
			allUsers.map(async (user) => {
				// const teamAllMemebers = await Promise.all(
				// allUsers.map(async (user) => {
				const userBaseData = extractUserBaseData(user, 'Team Owner');
				let lastActivity = 'N/A';
				let activitySince = 'N/A';
				let activityDate = 'N/A';
				let time = '00:00';
				let color = 'N/A';

				const query = {
					team_id: user.team_id,
					user_id: user.user_id,
				};
				/**
				 * Get latest entry
				 */
				const attendances = await AttendanceModel.find(query)
					.sort({ date: -1 })
					.limit(1);

				if (attendances.length === 1 && attendances[0].sessions.length > 0) {
					const lastSession =
						attendances[0].sessions[attendances[0].sessions.length - 1];
					if (lastSession.out_stamp > 0 && lastSession.in_stamp > 0) {
						lastActivity = 'out';
						activitySince = timeSince(lastSession.out_stamp * 1000);
						time = moment(lastSession.out_stamp * 1000)
							.tz(requestingUser.tz)
							.format('HH:MM');
						activityDate = moment(lastSession.out_stamp * 1000)
							.tz(requestingUser.tz)
							.format('MM-DD-YYYY');
						color = Color.outColor;
					} else if (lastSession.in_stamp > 0 && lastSession.out_stamp === 0) {
						lastActivity = 'in';
						activitySince = timeSince(lastSession.in_stamp * 1000);
						time = moment(lastSession.in_stamp * 1000)
							.tz(requestingUser.tz)
							.format('HH:MM');
						activityDate = moment(lastSession.in_stamp * 1000)
							.tz(requestingUser.tz)
							.format('MM-DD-YYYY');
						color = Color.inColor;
					}

					return {
						...userBaseData,
						lastActivity,
						activitySince,
						activityDate,
						time,
						color,
					};
				}
				return {
					...userBaseData,
					lastActivity,
					activitySince,
					activityDate,
					time,
					color,
				};
			})
		);

		return new APIResponse().success('OK', { teamAllMemebers });
	} catch (error) {
		return new APIResponse().error(error.statusCode, error.message);
	}
};
