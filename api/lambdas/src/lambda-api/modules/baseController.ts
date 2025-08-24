import { Connection } from '@typedorm/core';
import { API, NextFunction, Request, Response } from 'lambda-api';
import jwt from 'jsonwebtoken';
import { TUserTokenData } from '../types/types';
const JWT_SECRET = process.env.JWT_SECRET;

export class BaseController {
  constructor(protected api: API, protected dbConnection: Connection) {}

  checkTokenAuth(req: Request, res: Response): TUserTokenData {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).send({ message: 'Unauthorized' });
      throw new Error('Unauthorized');
    }
    if (!JWT_SECRET) {
      throw new Error('No JWT_SECRET found. Check env variables');
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      console.log(decodedToken);
      return decodedToken as TUserTokenData;
    } catch (error) {
      res.status(401).send({ message: 'Unauthorized' });
      throw new Error('Unauthorized');
    }
  }
}
