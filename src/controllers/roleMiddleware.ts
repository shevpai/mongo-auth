import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');
const config = require('config');

// interface extReq extends Request {
//   user?: object;
// }

export function roleMiddleware(roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { role: userRole } = jwt.verify(token, config.get('secretKey'));

      let hasRole = false;

      userRole.forEach((role: string) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return res.status(403).json({ message: 'Forbidden Error' });
      }

      next();
    } catch (e) {
      console.error(e.message);
      res.status(403).json({ message: e.message });
    }
  };
}
