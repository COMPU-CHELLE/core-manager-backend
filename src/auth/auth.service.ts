import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './types/jwt-payload.type';
import { RoleCode } from './enums/role.enum';
import { formatPermissions } from './utils/format-permissions';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    console.log('Attempting login for identifier:', identifier);
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { code: identifier }],
      },
      include: {
        company: true,
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    console.log('USER FOUND:', user);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña inválida');
    }

    const permissions = user.role.permissions.map(
      (rp) => `${rp.permission.module}.${rp.permission.action}`,
    );

    // Obtener empresas disponibles: todas si es global, solo la suya si no
    type CompanyInfo = {
      id: number;
      name: string;
      nit: string | null;
      logo: string | null;
    };
    let availableCompanies: CompanyInfo[] = [];
    if (user.role.isGlobal) {
      availableCompanies = await this.prisma.company.findMany({
        select: { id: true, name: true, nit: true, logo: true },
      });
    } else if (user.companyId) {
      availableCompanies = [
        {
          id: user.company!.id,
          name: user.company!.name,
          nit: user.company!.nit || null,
          logo: user.company!.logo || null,
        },
      ];
    }

    // Determinar empresa default
    const defaultCompanyId = user.role.isGlobal ? null : user.companyId;

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      code: user.code,
      companyId: defaultCompanyId,
      roleId: user.roleId,
      roleCode: user.role.code as RoleCode,
      isGlobal: user.role.isGlobal,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      user: {
        id: user.id,
        code: user.code,
        name: user.name,
        email: user.email,
        companyId: defaultCompanyId,
        roleCode: user.role.code,
        isGlobal: user.role.isGlobal,
      },
      availableCompanies,
      selectedCompany:
        availableCompanies.find((c) => c.id === defaultCompanyId) || null,
      permissions: formatPermissions(permissions),
      rawPermissions: permissions,
    };
  }

  async switchCompany(userId: number, newCompanyId: number | null) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    let selectedCompany: {
      id: number;
      name: string;
      nit: string | null;
      logo: string | null;
    } | null = null;

    // 🔥 Modo global
    if (newCompanyId === null) {
      if (!user.role.isGlobal) {
        throw new ForbiddenException('No puedes acceder en modo global');
      }
    } else {
      if (!user.role.isGlobal && user.companyId !== newCompanyId) {
        throw new ForbiddenException('No tienes permiso para esta empresa');
      }

      selectedCompany = await this.prisma.company.findUnique({
        where: { id: newCompanyId },
        select: {
          id: true,
          name: true,
          nit: true,
          logo: true,
        },
      });

      if (!selectedCompany) {
        throw new ForbiddenException('Empresa no encontrada');
      }
    }

    const permissions = user.role.permissions.map(
      (rp) => `${rp.permission.module}.${rp.permission.action}`,
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      code: user.code,
      companyId: newCompanyId,
      roleId: user.roleId,
      roleCode: user.role.code as RoleCode,
      isGlobal: user.role.isGlobal,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      selectedCompany,
    };
  }

  async getAvailableCompanies(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, company: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.role.isGlobal) {
      return this.prisma.company.findMany({
        select: { id: true, name: true, nit: true },
      });
    } else if (user.companyId) {
      return [
        {
          id: user.company!.id,
          name: user.company!.name,
          nit: user.company!.nit || null,
          logo: user.company!.logo || null,
        },
      ];
    }

    return [];
  }
}
