import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const userPermissions = request?.user?.permissions || [];

    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    console.log(
      userPermissions,
      requiredPermissions,
      hasAllRequiredPermissions,
    );

    if (requiredPermissions.length === 0 || hasAllRequiredPermissions) {
      return true;
    }

    throw new ForbiddenException('You do not have the required permissions');
  }
}
