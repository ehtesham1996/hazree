import { Request, Response } from 'express';
import { UserModel } from '@src/database';
import { AclList } from '../types';
import { chatPostMarkdown } from '../../slack/api';
import { randomResponse } from '../../bot-ai';
// import * as axios from 'axios';

export function accessControl(aclist: AclList) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const { selfCall } = req.body;
      if (!selfCall) {
        res.send('ok');
      }
      const command = res.locals.slack_command;
      const uuid = `${command.teamId}-${command.userId}`;
      const user = (await UserModel.query('id').eq(uuid).exec())[0];

      if (!user && command.command !== 'register') {
        await chatPostMarkdown(command.userId, '>You have to register with Hazree first');
        return;
      }
      const role = user?.role ?? 'any';
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
