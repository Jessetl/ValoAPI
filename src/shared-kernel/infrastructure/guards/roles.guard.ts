import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { FirebaseUser } from './firebase-auth.guard';

type AuthenticatedRequest = Request & {
  user?: FirebaseUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.getRequiredRoles(context);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
      return false;
    }

    const userRoles = new Set(user.roles);
    return requiredRoles.some((role) => userRoles.has(role));
  }

  private getRequiredRoles(context: ExecutionContext): string[] | undefined {
    return this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
