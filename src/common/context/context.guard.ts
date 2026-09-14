import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { RequestContext } from './request-context';
import { JwtPayload } from '../../auth/types/jwt-payload.type';

@Injectable({ scope: Scope.REQUEST }) // 🔥 CLAVE
export class ContextGuard implements CanActivate {
  constructor(private readonly ctx: RequestContext) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = req.user;

    if (!user) {
      return true;
    }

    this.ctx.userId = user.sub;
    this.ctx.companyId = user.companyId;
    this.ctx.roleId = user.roleId;
    this.ctx.roleCode = user.roleCode;
    this.ctx.isGlobal = user.isGlobal;
    this.ctx.permissions = user.permissions ?? [];

    console.log('CTX OK:', {
      userId: this.ctx.userId,
      companyId: this.ctx.companyId,
      isGlobal: this.ctx.isGlobal,
    });

    return true;
  }
}
