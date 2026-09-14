import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestContext } from '../../common/context/request-context';
import { RoleCode } from '../enums/role.enum';

@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly context: RequestContext,
  ) {}

  canActivate(execContext: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleCode[]>(
      ROLES_KEY,
      [execContext.getHandler(), execContext.getClass()],
    );

    if (!requiredRoles) return true;

    // Los usuarios globales pueden acceder a todo
    if (this.context.isGlobal) return true;

    return (
      this.context.roleCode != null &&
      requiredRoles.includes(this.context.roleCode)
    );
  }
}
