import { Request, Response } from 'express';

export async function pong(_req: Request, res: Response): Promise<void> {
  res.send('pong');
}
