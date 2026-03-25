import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FirebaseUser } from '../guards/firebase-auth.guard.js';

export const CurrentUser = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: FirebaseUser = request.user;

    return data ? user?.[data] : user;
  },
);
