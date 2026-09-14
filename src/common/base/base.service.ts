import { ForbiddenException } from '@nestjs/common';
import { RequestContext } from '../context/request-context';

type WithCompanyId = {
  companyId?: number;
  id?: number;
  [key: string]: any;
};

export abstract class BaseService {
  constructor(protected readonly context: RequestContext) {}

  /**
   * 🔐 Aplica filtro tenant-safe
   * ✔ Nunca null
   * ✔ Compatible con Prisma
   */
  protected applyTenantFilter<T extends WithCompanyId>(
    where?: T,
  ): T | undefined {
    // 🔥 MODO GLOBAL REAL
    if (this.context.isGlobal && this.context.companyId === null) {
      return where; // ve todo
    }

    if (!this.context.companyId) {
      throw new Error('RequestContext not initialized');
    }

    return {
      ...(where ?? {}),
      companyId: this.context.companyId,
    } as T;
  }

  protected applyCompanyFilter() {
    if (this.context.isGlobal && this.context.companyId === null) {
      return {};
    }

    if (!this.context.companyId) {
      throw new Error('RequestContext not initialized');
    }

    return {
      id: this.context.companyId,
    };
  }

  /**
   * 🔐 Validación cross-tenant
   */
  protected validateTenantAccess(resourceCompanyId?: number | null) {
    if (this.context.isGlobal) return;

    if (!resourceCompanyId || resourceCompanyId !== this.context.companyId) {
      throw new ForbiddenException('Cross-tenant access denied');
    }
  }

  protected resolveCompanyId(dtoCompanyId?: number) {
    if (this.context.isGlobal && this.context.companyId === null) {
      return dtoCompanyId;
    }
    return this.context.companyId;
  }

  /**
   * 🔐 Excluye registros con soft-delete aplicado.
   * Solo usar en modelos que tengan la columna `deletedAt`.
   */
  protected excludeDeleted(where?: Record<string, any>): any {
    return {
      ...(where ?? {}),
      deletedAt: null,
    };
  }

  protected raw<T>(payload: T) {
    return {
      __raw: true,
      payload,
    };
  }

  protected ok<T>(data: T, message?: string) {
    return {
      __raw: true as const,
      payload: {
        success: true,
        message: message ?? null,
        type: 'success' as const,
        data,
      },
    };
  }

  protected info<T>(data: T, message: string) {
    return {
      __raw: true as const,
      payload: {
        success: true,
        message,
        type: 'info' as const,
        data,
      },
    };
  }
}
