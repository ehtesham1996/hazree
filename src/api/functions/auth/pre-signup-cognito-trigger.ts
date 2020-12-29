/* eslint-disable no-param-reassign */
import { UsersModel } from '@src/database';
import { getUsersByEmailFromCognito } from '@src/services/users.service';
import { PreSignUpTriggerHandler } from 'aws-lambda';
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminLinkProviderForUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const linkProviderToUser = async (username, userPoolId, providerName, providerUserId): Promise<AdminLinkProviderForUserResponse | AWSError> => {
  const cognitoIdp = new CognitoIdentityServiceProvider();
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: 'Cognito'
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName
    },
    UserPoolId: userPoolId
  };

  const result: AdminLinkProviderForUserResponse | AWSError = await (new Promise((resolve, reject) => {
    cognitoIdp.adminLinkProviderForUser(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(data);
    });
  }));
  return result;
};

function capitalizeFirstLetter(letter: string): string {
  return letter.charAt(0).toUpperCase() + letter.slice(1);
}

export const handler: PreSignUpTriggerHandler = async (event, _context, callback) => {
  const userRs = await getUsersByEmailFromCognito(event.userPoolId, event.request.userAttributes.email);

  let userId = event.userName;
  const { name, picture = '' } = event.request.userAttributes;
  if (userRs && userRs.Users.length > 0) {
    const user = userRs.Users[0];
    userId = user.Username;
    if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      console.log('Inside of PreSignUp_ExternalProvider');

      const [providerName, providerUserId] = event.userName.split('_'); // event userName example: "Facebook_12324325436"
      await linkProviderToUser(userId, event.userPoolId, capitalizeFirstLetter(providerName), providerUserId);

      event.response.autoVerifyEmail = true;

      const userData = (await UsersModel.query('user_id').eq(userId).exec())[0];
      userData.name = userData.name || name;
      userData.profile_picture = userData.profile_picture || picture;
      userData.save();
    } else if (event.triggerSource === 'PreSignUp_SignUp' || event.triggerSource === 'PreSignUp_AdminCreateUser') {
      console.log('Inside of PreSignUp_SignUp and PreSignUp_AdminCreateUser');
      return callback(new Error('A social account with that email already exists.Please signin using social sign-in options'), event);
    }
  } else {
    const userData = new UsersModel({
      user_id: userId,
      name,
      email: event.request.userAttributes.email || '',
      profile_picture: picture
    });
    userData.save();
    if (event.triggerSource === 'PreSignUp_AdminCreateUser'
      || event.triggerSource === 'PreSignUp_ExternalProvider') {
      event.response.autoVerifyEmail = true;
    }
  }

  console.log(JSON.stringify(event, null, 2));
  return callback(null, event);
};
