import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');
const config = require('config');

interface extReq extends Request {
  user?: object;
}

export function authMiddleware(req: extReq, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const decodeData = jwt.verify(token, config.get('secretKey'));
    req.user = decodeData;
    next();
  } catch (e) {
    console.error(e.message);
    res.status(403).json({ message: e.message });
  }
}
