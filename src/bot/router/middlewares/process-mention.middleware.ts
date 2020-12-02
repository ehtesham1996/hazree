import { Request, Response } from 'express';
import { parseEvent } from '../functions/parse-event.function';

export async function processMention(req: Request, res: Response, next: () => void): Promise<void> {
  try {
    res.locals.slack_command = parseEvent(req);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'internal error' });
  }
}
