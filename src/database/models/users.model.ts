import * as dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { Document } from 'dynamoose/dist/Document';
import { TABLE_PREFIX } from '../functions';

const ADMIN = 'admin';
const USER = 'user';
const ANY = 'any';

export const USER_ROLES = { ADMIN, USER, ANY };

export interface SlackData {
  slack_user_id: string;
}
export interface Users {
  user_id: string;
  name: string;
  email: string;
  profile_picture?: string;
  slack_data?: SlackData;
}

const schema = new dynamoose.Schema({
  user_id: { type: String, required: true, hashKey: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profile_picture: { type: String },
  slack_data: {
    type: Object,
    schema: {
      slack_user_id: { type: String, required: true }
    }
  }
});

export type UsersDocument = Users & Document;
export type UsersModel = ModelType<UsersDocument>
export const UsersModel = dynamoose.model<UsersDocument>('users', schema, { prefix: `${TABLE_PREFIX}` || 'dev_', create: false });
