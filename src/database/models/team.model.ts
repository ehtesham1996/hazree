import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import { TABLE_PREFIX } from '../functions';

export type TeamDocument = Document & {
  id: string;
  name: string;
  slack_team_id: string;
  created_by: string;
  created_date: number;
  admins: Array<string>;
  members: Array<string>;
  pending_invites: Array<string>;

}
const schema = new dynamoose.Schema({
  id: {
    required: true,
    hashKey: true,
    type: String
  },
  name: {
    required: true,
    type: String
  },
  slack_team_id: {
    type: String
  },
  created_by: {
    required: true,
    type: String
  },
  created_date: {
    required: true,
    type: Number
  },
  admins: {
    required: true,
    type: Array,
    schema: [String]
  },
  members: {
    required: true,
    type: Array,
    schema: [String]
  },
  pending_invites: {
    required: true,
    type: Array,
    schema: [String]
  }
});

export const TeamModel = dynamoose.model<TeamDocument>('team', schema, { prefix: TABLE_PREFIX, create: false });
