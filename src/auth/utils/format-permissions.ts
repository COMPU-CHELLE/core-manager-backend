export interface ModulePermissions {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export type PermissionsMap = Record<string, ModulePermissions>;

/**
 * Formatea permisos en un objeto legible para el frontend
 * Agrupa permisos por módulo con las acciones disponibles
 */
export function formatPermissions(permissions: string[]): PermissionsMap {
  const formatted: PermissionsMap = {};

  for (const perm of permissions) {
    const [module, action] = perm.split('.');
    if (!module || !action) continue;

    if (!formatted[module]) {
      formatted[module] = {
        read: false,
        create: false,
        update: false,
        delete: false,
      };
    }

    const modulePerms = formatted[module];
    if (
      action === 'read' ||
      action === 'create' ||
      action === 'update' ||
      action === 'delete'
    ) {
      modulePerms[action] = true;
    }
  }

  return formatted;
}
