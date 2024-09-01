import { Injectable, NestMiddleware, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../firebase-admin.validation';
@Injectable()
export class MiddlewareService implements NestMiddleware {


  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.error("No token Provided")
      res.send(404).json({ message: "No token Provided"})
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req['firebaseUserId'] = decodedToken.uid;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  }

}
