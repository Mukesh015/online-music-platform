import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { firebaseAdmin } from '../firebase-admin.validation';  // Ensure the path is correct

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);  // Debugging line

    if (!authHeader) {
     
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);  // Debugging line
      req['firebaseUserId'] = decodedToken.uid;
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);  // Debugging line
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
