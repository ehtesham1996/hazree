import { Request, Response } from 'express';
import { parseCommand } from '../functions/parse-command.function';

export function processSlashCommand(req: Request, res: Response, next: () => void): void {
  try {
    res.locals.slack_command = parseCommand(req);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'internal error' });
  }
}
