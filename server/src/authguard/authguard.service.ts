import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { firebaseAdmin } from '../firebase-admin.validation';  // Ensure the path is correct

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req['firebaseUserId'] = "null";
      return true; 
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req['firebaseUserId'] = "null";
      return true; 
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req['firebaseUserId'] = decodedToken.uid;
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      req['firebaseUserId'] = "invalid"; 
      return true; 
    }
  }
}
