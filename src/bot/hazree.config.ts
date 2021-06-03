import { USER_ROLES } from '@src/database/models';
import { AclList } from './router/types';
import {
  back, brb, punchIn, punchOut, register, timesheet, team, help
} from './commands';
import { joke } from './commands/joke/joke.command';

const { ADMIN, USER, ANY } = USER_ROLES;

const Acl: AclList = Object.freeze({
  in: {
    exec: punchIn,
    allowed: [ADMIN, USER]
  },
  out: {
    exec: punchOut,
    allowed: [ADMIN, USER]
  },
  brb: {
    exec: brb,
    allowed: [ADMIN, USER]
  },
  back: {
    exec: back,
    allowed: [ADMIN, USER]
  },
  register: {
    exec: register,
    allowed: [ADMIN, USER, ANY]
  },
  timesheet: {
    exec: timesheet,
    allowed: [ADMIN, USER, ANY]
  },
  team: {
    exec: team,
    allowed: [ADMIN, USER]
  },
  joke: {
    exec: joke,
    allowed: [ADMIN, USER, ANY]
  },
  help: {
    exec: help,
    allowed: [ADMIN, USER, ANY]
  }
});

export default Acl;
