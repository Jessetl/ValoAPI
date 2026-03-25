import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { FIREBASE_ADMIN } from '../firebase/firebase-admin.provider.js';

export interface FirebaseUser {
  uid: string;
  email?: string;
  roles: string[];
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: typeof admin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(token);

      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        roles: (decodedToken as Record<string, unknown>).roles as string[] || [],
      } satisfies FirebaseUser;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}
