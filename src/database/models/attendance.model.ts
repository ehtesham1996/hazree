/* eslint-disable camelcase */
import * as dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { TABLE_PREFIX } from '../functions';

export interface Session {
  in_stamp: number;
  out_stamp: number;
  comment: string;
  ses_type: string;
}

export type AttendanceDocument = Document & {
  team_id: string;
  user_id: string;
  date: number;
  sessions: Array<Session>;
}

const schema = new dynamoose.Schema({
  team_id: { type: String, required: true },
  user_id: { type: String, required: true, hashKey: true },
  date: { type: Number, required: true, rangeKey: true },
  sessions: {
    type: 'Array',
    schema: [
      {
        type: 'Object',
        schema: {
          in_stamp: Number,
          out_stamp: Number,
          comment: String,
          ses_type: String
        }
      }
    ]
  }
});

export const AttendanceModel = dynamoose.model<AttendanceDocument>('attendance', schema, { prefix: TABLE_PREFIX, create: false });
