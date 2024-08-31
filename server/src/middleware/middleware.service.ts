import { Injectable, NestMiddleware, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../firebase-admin.validation';
@Injectable()
export class MiddlewareService implements NestMiddleware {


  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req['firebaseUserId'] = decodedToken.uid;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

}
