import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { FirebaseUser } from '../guards/firebase-auth.guard';

type CurrentUserParam = keyof FirebaseUser | undefined;
type CurrentUserValue =
  | FirebaseUser
  | FirebaseUser[keyof FirebaseUser]
  | undefined;

export const CurrentUser = createParamDecorator<
  CurrentUserParam,
  CurrentUserValue
>((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user?: FirebaseUser }>();
  const user = request.user;

  return data ? user?.[data] : user;
});
