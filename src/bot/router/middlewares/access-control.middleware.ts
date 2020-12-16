import { Request, Response } from 'express';
import { UsersModel, USER_ROLES } from '@src/database';
import { UserCommand } from '@src/core';
import { AclList } from '../types';
import { chatPostMarkdown } from '../../slack/api';
import { randomResponse } from '../../bot-ai';
// import * as axios from 'axios';

export function accessControl(aclist: AclList) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('acl called');
      const { selfCall } = req.body;
      if (!selfCall) {
        res.send('ok');
      }

      const command: UserCommand = res.locals.slack_command;
      const slackUserId = command.userId;
      // const uuid = `${command.teamId}-${command.userId}`;
      const user = (await UsersModel
        .scan()
        .where('slack_data.slack_user_id').eq(slackUserId)
        .exec())[0];

      console.log(user);

      if (!user && command.command !== 'register') {
        await chatPostMarkdown(
          command.userId,
          '>You have to register with Hazree first.\n> Please use command `@hazree register` to register with us'
        );
        return;
      }
      // const role = user?.role ?? 'any'; skipping user roles in v1.1
      const role = USER_ROLES.USER;
      const route = aclist[command.command];
      if (!route) {
        await randomResponse(command, user);
        return;
      }
      if (!route.allowed.includes(role)) {
        await chatPostMarkdown(command.userId, '>You are not authorised to run this command');
        return;
      }
      await route.exec(command, user);

      if (selfCall) {
        res.send('ok');
      }
    } catch (e) {
      console.log(e);
    }
  };
}
