import { UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionsGuard } from './permissions.guard';
import { Permissions } from './permissions.decorator';

/**
 * Decorador compuesto que aplica tanto @Permissions como @UseGuards(PermissionsGuard)
 * Uso: @RequirePermissions('users.create', 'assets.delete')
 */
export function RequirePermissions(...permissions: string[]) {
  return applyDecorators(
    Permissions(...permissions),
    UseGuards(PermissionsGuard),
  );
}
