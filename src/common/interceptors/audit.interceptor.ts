import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AuditService } from '../../audit/audit.service';
import { RequestContext } from '../context/request-context';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

interface EntityWithId {
  id?: number;
}

@Injectable({ scope: Scope.REQUEST })
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly context: RequestContext,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    const method = request.method;
    const path = request.originalUrl;
    const ip = request.ip;

    return next.handle().pipe(
      tap((response: unknown) => {
        const req = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
        const user = req.user;
        if (!['POST', 'PATCH', 'DELETE'].includes(method)) return;

        const entityId =
          typeof response === 'object' && response !== null && 'id' in response
            ? (response as EntityWithId).id
            : undefined;

        void this.auditService.log({
          userId: this.context.userId ?? user?.sub,
          companyId: this.context.companyId ?? user?.companyId,
          action: method,
          entity: request.originalUrl.split('/')[1] ?? 'unknown',
          entityId,
          method,
          path,
          ip,
        });
      }),
    );
  }
}
