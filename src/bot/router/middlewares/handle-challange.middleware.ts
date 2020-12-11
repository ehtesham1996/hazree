import { Request, Response } from 'express';
import {
  string, object, assert
} from 'superstruct';

const Challenge = object({
  type: string(),
  token: string(),
  challenge: string()
});

export function handleChallange(req: Request, res: Response, next: () => void): void {
  try {
    console.log('Handle challenge middlware called');
    if (req.body?.type === 'url_verification') {
      assert(req.body, Challenge);
      res.json({ challenge: req.body.challenge });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ error: 'internal error' });
  }
}
