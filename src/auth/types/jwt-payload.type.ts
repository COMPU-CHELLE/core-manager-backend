import { RoleCode } from '../enums/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  code: string;
  companyId: number | null;
  roleId: number;
  roleCode: RoleCode;
  isGlobal: boolean;
  permissions: string[];
}
