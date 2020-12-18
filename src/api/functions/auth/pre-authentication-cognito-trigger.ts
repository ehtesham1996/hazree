/* eslint-disable no-param-reassign */
import { getUsersByEmailFromCognito } from '@src/services/users.service';
import { PreAuthenticationTriggerHandler } from 'aws-lambda';

export const handler: PreAuthenticationTriggerHandler = async (event, _context, callback) => {
  console.log('Payload ===> ', JSON.stringify(event, null, 2));

  if (event.request.validationData.email) {
    const userRs = await getUsersByEmailFromCognito(event.userPoolId, event.request.validationData.email);
    console.log('Users ', JSON.stringify(userRs, null, 2));

    if (userRs.Users.length === 1) {
      const user = userRs.Users[0];
      console.log('Existing user is ', user);

      if (user.UserStatus === 'EXTERNAL_PROVIDER') {
        return callback(
          new Error('A social account with that email already exists. Please login using social sign-in options'),
          event
        );
      }
    }
  }

  console.log('Response ==>', JSON.stringify(event, null, 2));
  return callback(null, event);
};
