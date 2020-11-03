/* eslint-disable @typescript-eslint/camelcase */
import {
  Schema, Document, Model, model, models
} from 'mongoose';
import { User } from '../../core';

export type UserDocument = Document & User;

const schema: Schema<UserDocument> = new Schema({
  _id: { type: String, required: true },
  team_id: { type: String, required: true },
  user_id: { type: String, required: true },
  real_name: { type: String, required: true },
  display_name: { type: String, required: true },
  tz: { type: String, required: true },
  tz_label: { type: String, required: true },
  tz_offset: { type: Number, required: true },
  role: { type: String, required: true }
});

export const UserModel: Model<UserDocument> = models.User || model('User', schema);
