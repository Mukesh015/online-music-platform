import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { firebaseAdmin } from '../firebase-admin.validation';  // Ensure the path is correct

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers.authorization;

    // Handle missing Authorization header
    if (!authHeader) {
      req['firebaseUserId'] = "null";
      return true; // Allow request to proceed but set firebaseUserId to "null"
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req['firebaseUserId'] = "null";
      return true; // Allow request to proceed but set firebaseUserId to "null"
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req['firebaseUserId'] = decodedToken.uid;
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      req['firebaseUserId'] = "invalid"; // Set firebaseUserId to "null" on error
      return true; // Allow request to proceed but set firebaseUserId to "null"
    }
  }
}
