import { UserCommand } from '@src/core/types/user-command.type';
import { UsersDocument } from '@src/database/models';

export interface AclList {
  [command: string ]: {
    allowed: Array<string>;
    exec: (com: UserCommand, user: UsersDocument | null) => Promise<void>;
  };
}
