import { BadRequestError } from '@src/core';
import { UsersDocument, UsersModel } from '@src/database';
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminCreateUserRequest, ListUsersResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export type UserRegistrationData = {
  name: string;
  password?: string;
  email: string;
  slack_user_id?: string;
}

export type RegisterUserReturnType = Promise<AWSError | BadRequestError | string>

/**
 * @param userData the name, password and email* of user
 * @param sendEmail boolean whether to send email or not for default password
 * @description Registers the user with cognito and cognito then trigger the presignup trigger
 *              to save this user in the dynamodb. This will send default email and password to
 *              user if the sendEmail boolean is set.
 */
export const registerUser = (userData: UserRegistrationData, sendEmail: boolean): RegisterUserReturnType => new Promise((resolve, reject) => {
  const cognitoIdp = new CognitoIdentityServiceProvider();

  if (!userData.name || !userData.email) reject(new BadRequestError('Please specify name and email'));

  const params: AdminCreateUserRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userData.email,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'name',
        Value: userData.name
      }
    ]

  };

  if (userData.password) {
    params.TemporaryPassword = userData.password;
  }

  if (!sendEmail) {
    params.MessageAction = 'SUPPRESS';
  }

  try {
    cognitoIdp.adminCreateUser(params, async (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (userData.slack_user_id) {
        const user = (await UsersModel.query('user_id').eq(data.User.Username).exec())[0];
        user.slack_data = { slack_user_id: userData.slack_user_id };
        await user.save();
      }
      resolve(data.User.Username);
    });
  } catch (error) {
    reject(error);
  }
});

export const getUsersByEmailFromCognito = async (userPoolId, email): Promise<ListUsersResponse> => {
  const cognitoIdp = new CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`
  };
  return cognitoIdp.listUsers(params).promise();
};

export const getUsersByEmail = async (email: string): Promise<UsersDocument[]> => {
  const users: UsersDocument[] = await UsersModel
    .scan()
    .where('email').eq(email)
    .all()
    .exec();
  return users;
};
