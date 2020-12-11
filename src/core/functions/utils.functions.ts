import { UserBaseData } from '@src/core/types';
import { UsersDocument, USER_ROLES } from '@src/database';

/**
 * @param seconds number of seconds to be converted to HH::MM
 * @description This utiltiy function convert the number of seconds to HH:MM format
 */
export function convertSecondToHHMM(seconds = 0): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  // eslint-disable-next-line prefer-template
  return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
}

/**
 * @param user The user document extracted via moongose
 * @description This is a helper function that extract the basic user data required
 *              by the timesheet api's
 */
export function extractUserBaseData(user: UsersDocument, role = USER_ROLES.USER): UserBaseData {
  const { name } = user;

  const [firstName, lastName] = name.split(' ', 2);
  let initials = firstName[0] + (lastName ? lastName[0] : firstName[1]);
  initials = initials.toUpperCase();
  return {
    name,
    userId: user.user_id,
    imageUrl: user.profile_picture || 'https://randomuser.me/api/portraits/men/97.jpg',
    initials,
    role
  };
}

export function timeSince(date): string {
  const seconds = Math.floor((new Date().getTime() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 2) {
    return `${Math.floor(interval)} days ago`;
  } if (interval > 0) {
    return 'Yesterday';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
}
