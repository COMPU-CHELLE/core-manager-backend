import { Injectable, Scope } from '@nestjs/common';
import { RoleCode } from '../../auth/enums/role.enum';

@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  userId: number | null = null;
  companyId: number | null = null;
  roleId: number | null = null;
  roleCode: RoleCode | null = null;
  isGlobal = false;
  permissions: string[] = [];
}
