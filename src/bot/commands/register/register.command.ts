/* eslint-disable @typescript-eslint/camelcase */
import { UserCommand } from '@src/core';
import { UsersDocument } from '@src/database/models';
import { getUsersByEmail, registerUser } from '@src/services/users.service';
import { chatPostMarkdown, userInfo } from '../../slack/api';

export async function register(com: UserCommand, user: UsersDocument): Promise<void> {
  let registrationMsg = '>You are already registered :robot_face:';

  if (!user) {
    const userData = await userInfo(com.userId);
    const {
      real_name,
      profile: {
        image_original = '',
        email
      }
    } = userData.data.user;

    const users = await getUsersByEmail(email);
    /**
     * This means that a user with this email
     * already exists just attaching his slack data to
     * this document
     */
    if (users.length > 0) {
      const existingUser = users[0];
      existingUser.slack_data = { slack_user_id: com.userId };
      if (image_original) {
        existingUser.profile_picture = existingUser.profile_picture || image_original;
      }
      await existingUser.save();
      registrationMsg = '>You have successfully registered :tada: \n>Your hazree portal account has been linked';
    } else {
      /**
       * This means the user is a new user
       * and we have to create his cognito account
       * */
      await registerUser({
        name: real_name,
        email,
        slack_user_id: com.userId,
        picture: image_original
      }, true);
      registrationMsg = '>You have successfully registered :tada: \n>Your login credentials for hazree portal are sent by email';
    }
  }

  await chatPostMarkdown(com.userId, registrationMsg);
}
