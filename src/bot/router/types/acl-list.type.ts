import { UserCommand } from '@src/core/types/user-command.type';
import { UserDocument } from '@src/database/models';

export interface AclList {
  [command: string ]: {
    allowed: Array<string>;
    exec: (com: UserCommand, user: UserDocument | null) => Promise<void>;
  };
}
