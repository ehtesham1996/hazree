/* eslint-disable linebreak-style */
import { UserBaseDataForTeam } from '@src/core/types';
import { UserDocument } from '@src/database';
/**
 * @param user The user document extracted via moongose
 * @description This is a helper function that extract the basic user data required
 *              by the timesheet api's
 */
export function extractUserBaseData(
	user: UserDocument,
	post: string
): UserBaseDataForTeam {
	const name = user.display_name || user.real_name;

	const [firstName, lastName] = name.split(' ', 2);
	let initials = firstName[0] + (lastName ? lastName[0] : firstName[1]);
	initials = initials.toUpperCase();
	/**
	 * Using hardcoded image URL temporarily
	 */
	return {
		name,
		userId: user._id,
		imageUrl:
			'http://www.chicagohrs.com/wp-content/uploads/2017/05/Man-Placeholder.png',
		initials,
		post,
	};
}
