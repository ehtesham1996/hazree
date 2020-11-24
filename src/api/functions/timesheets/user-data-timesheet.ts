import { UserBaseDataForTimeSheet } from '@src/core';
import { UserDocument } from '@src/database';
/**
 * @param user The user document extracted via moongose
 * @description This is a helper function that extract the basic user data required
 *              by the timesheet api's
 */
export function extractUserBaseData(user: UserDocument): UserBaseDataForTimeSheet {
  const name = user.display_name || user.real_name;

  const [firstName, lastName] = name.split(' ', 2);
  let initials = firstName[0] + (lastName ? lastName[0] : firstName[1]);
  initials = initials.toUpperCase();
  return {
    name,
    userId: user.id,
    imageUrl: user.profile_picture || 'https://randomuser.me/api/portraits/men/97.jpg',
    initials

  };
}
