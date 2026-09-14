import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { RequestContext } from '../context/request-context';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly ctx: RequestContext,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    if (!this.ctx.permissions || this.ctx.permissions.length === 0) {
      throw new ForbiddenException('Permissions not loaded in context');
    }

    const hasPermission = required.some((p) =>
      this.ctx.permissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Se requiere uno de estos permisos: ${required.join(', ')}`,
      );
    }

    return true;
  }
}
