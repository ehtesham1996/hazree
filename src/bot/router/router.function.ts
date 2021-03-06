import * as express from 'express';
import { Router } from 'express';
import { AclList } from './types';
import { accessControl } from './middlewares/access-control.middleware';
import { handleChallange } from './middlewares/handle-challange.middleware';
import { processMention } from './middlewares/process-mention.middleware';
import { processSlashCommand } from './middlewares/process-slash-command.middleware';
import { pong } from './functions/pong.function';
import { sendResponseAndSelfCall } from './functions';

export function router(routes: AclList): Router {
  const expRouter = express.Router();
  const acl = accessControl(routes);
  expRouter.get('/ping', pong);
  if (process.env.IS_OFFLINE) {
    console.log('Proccessing /mention offline');
    expRouter.post('/mention', handleChallange, processMention, acl);
  } else {
    console.log('Processing /mention online');
    expRouter.post('/mention', handleChallange, sendResponseAndSelfCall);
    expRouter.post('/mention-call-back', handleChallange, processMention, acl);
  }

  expRouter.post('/slashcommand', handleChallange, processSlashCommand, acl);
  return expRouter;
}
