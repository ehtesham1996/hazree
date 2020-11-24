/* eslint-disable camelcase */

import * as dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { Document } from 'dynamoose/dist/Document';
import { TABLE_PREFIX } from '../functions';

const ADMIN = 'admin';
const USER = 'user';
const ANY = 'any';

export const USER_ROLES = { ADMIN, USER, ANY };

export interface User {
  id: string;
  team_id: string;
  user_id: string;
  real_name: string;
  display_name: string;
  tz: string;
  profile_picture?: string;
  tz_label: string;
  tz_offset: number;
  role: string;
}

const schema = new dynamoose.Schema({
  id: {
    type: String, required: true, hashKey: true
  },
  team_id: { type: String, required: true },
  user_id: { type: String, required: true },
  username: { type: String, required: true },
  real_name: { type: String, required: true },
  display_name: { type: String, required: true },
  tz: { type: String, required: true },
  profile_picture: { type: String },
  tz_label: { type: String, required: true },
  tz_offset: { type: Number, required: true },
  role: { type: String, required: true, enum: Object.values(USER_ROLES) }
});

export type UserDocument = User & Document;
export type UserModel = ModelType<UserDocument>
export const UserModel = dynamoose.model<UserDocument>('user', schema, { prefix: `${TABLE_PREFIX}` || 'dev_', create: false });
