import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const modules = [
    'companies',
    'users',
    'roles',
    'roles.permissions',
    'branches',
    'plans',
    'employees',
    'assets',
    'asset_assignments',
    'maintenances',
    'tickets',
    'invoices',
    'credentials',
    'tasks',
    'dashboard',
    'audit',
  ];

  const actions = [
    { action: 'create', name: 'crear' },
    { action: 'read', name: 'ver' },
    { action: 'update', name: 'actualizar' },
    { action: 'delete', name: 'eliminar' },
    { action: 'softdelete', name: 'eliminar (lógico)' },
  ];

  // -----------------------------------------------------
  // Crear permisos normales
  // -----------------------------------------------------

  for (const module of modules) {
    for (const { action, name } of actions) {
      await prisma.permission.upsert({
        where: {
          module_action: {
            module,
            action,
          },
        },
        update: {},
        create: {
          name,
          code: `${module}.${action}`,
          module,
          action,
        },
      });
    }
  }

  // -----------------------------------------------------
  // Permiso especial de credenciales
  // -----------------------------------------------------

  await prisma.permission.upsert({
    where: {
      module_action: {
        module: 'credentials',
        action: 'reveal',
      },
    },
    update: {},
    create: {
      name: 'revelar clave',
      code: 'credentials.reveal',
      module: 'credentials',
      action: 'reveal',
    },
  });

  const allPermissions = await prisma.permission.findMany();

  console.log(`✅ Permisos disponibles: ${allPermissions.length}`);

  // =====================================================
  // PLANES
  // =====================================================

  const plan1 = await prisma.plan.create({
    data: {
      name: 'Básico',
      price: 200000,
      maxUsers: 5,
      maxAssets: 50,
    },
  });

  const plan2 = await prisma.plan.create({
    data: {
      name: 'Premium',
      price: 500000,
      maxUsers: 10,
      maxAssets: 100,
    },
  });

  // =====================================================
  // ROLES
  // =====================================================

  // -----------------------------------------------------
  // SOPORTE
  // -----------------------------------------------------

  const soporteRole = await prisma.role.create({
    data: {
      code: 'SOPORTE',
      name: 'Soporte Sistema',
      isGlobal: true,
    },
  });

  // -----------------------------------------------------
  // EMPRESAS
  // -----------------------------------------------------

  const company1 = await prisma.company.create({
    data: {
      name: 'EMPRESA1 S.A.S',
      nit: '900900900-1',
      planId: plan1.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'EMPRESA2 S.A.S',
      nit: '800800800-1',
      planId: plan2.id,
    },
  });

  // -----------------------------------------------------
  // ADMIN
  // -----------------------------------------------------

  const adminRole1 = await prisma.role.create({
    data: {
      code: 'ADMIN',
      name: 'Administrador Empresa',
      companyId: company1.id,
      isGlobal: false,
    },
  });

  const adminRole2 = await prisma.role.create({
    data: {
      code: 'ADMIN',
      name: 'Administrador Empresa',
      companyId: company2.id,
      isGlobal: false,
    },
  });

  // -----------------------------------------------------
  // USER
  // -----------------------------------------------------

  const userRole1 = await prisma.role.create({
    data: {
      code: 'USER',
      name: 'Usuario Empresa',
      companyId: company1.id,
      isGlobal: false,
    },
  });

  const userRole2 = await prisma.role.create({
    data: {
      code: 'USER',
      name: 'Usuario Empresa',
      companyId: company2.id,
      isGlobal: false,
    },
  });

  // =====================================================
  // PERMISOS SOPORTE
  // =====================================================

  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: soporteRole.id,
        permissionId: permission.id,
      },
    });
  }

  // =====================================================
  // MÓDULOS ADMIN
  // =====================================================

  const adminModules = [
    'branches',
    'employees',
    'credentials',
    'tasks',
    'tickets',
    'assets',
    'asset_assignments',
    'maintenances',
    'invoices',
    'audit',
    'dashboard',
  ];

  // -----------------------------------------------------
  // Permisos ADMIN
  // Todos los permisos de los módulos operativos
  // -----------------------------------------------------

  const adminPermissions = allPermissions.filter(
    (permission) =>
      adminModules.includes(permission.module) &&
      permission.action !== 'reveal',
  );

  for (const permission of adminPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole1.id,
        permissionId: permission.id,
      },
    });

    await prisma.rolePermission.create({
      data: {
        roleId: adminRole2.id,
        permissionId: permission.id,
      },
    });
  }

  // =====================================================
  // PERMISOS USER
  // =====================================================

  const userPermissions = allPermissions.filter(
    (permission) =>
      adminModules.includes(permission.module) &&
      ['read', 'create', 'update'].includes(permission.action),
  );

  for (const permission of userPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: userRole1.id,
        permissionId: permission.id,
      },
    });

    await prisma.rolePermission.create({
      data: {
        roleId: userRole2.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Roles y permisos configurados');

  // =====================================================
  // PASSWORDS
  // =====================================================

  const soportePassword = await bcrypt.hash('Soporte123', 10);
  const adminPassword = await bcrypt.hash('Admin123', 10);
  const userPassword = await bcrypt.hash('User123', 10);

  // =====================================================
  // USUARIO SOPORTE
  // =====================================================

  await prisma.user.create({
    data: {
      code: 'SOPORTE',
      name: 'Soporte General',
      email: 'soporte@system.com',
      password: soportePassword,
      companyId: company1.id,
      roleId: soporteRole.id,
    },
  });

  // =====================================================
  // EMPRESA 1
  // =====================================================

  // -----------------------------------------------------
  // SEDE
  // -----------------------------------------------------

  const branch1 = await prisma.branch.create({
    data: {
      code: 'MAIN',
      name: 'Sede Principal',
      address: 'Calle 123 #45-67',
      email: 'principal@empresa1.demo',
      companyId: company1.id,
    },
  });

  // -----------------------------------------------------
  // ADMIN EMPRESA 1
  // -----------------------------------------------------

  await prisma.user.create({
    data: {
      code: 'ADMIN1',
      name: 'Administrador Empresa 1',
      email: 'admin@empresa1.demo',
      password: adminPassword,
      companyId: company1.id,
      roleId: adminRole1.id,
    },
  });

  // -----------------------------------------------------
  // USER EMPRESA 1
  // -----------------------------------------------------

  await prisma.user.create({
    data: {
      code: 'USER1',
      name: 'Usuario Empresa 1',
      email: 'user@empresa1.demo',
      password: userPassword,
      companyId: company1.id,
      roleId: userRole1.id,
    },
  });

  // -----------------------------------------------------
  // EMPLEADOS EMPRESA 1
  // -----------------------------------------------------

  await prisma.employee.createMany({
    data: [
      {
        name: 'Juan Pérez',
        position: 'Desarrollador',
        email: 'juan@empresa1.demo',
        companyId: company1.id,
        branchId: branch1.id,
      },
      {
        name: 'María Gómez',
        position: 'Soporte TI',
        email: 'maria@empresa1.demo',
        companyId: company1.id,
        branchId: branch1.id,
      },
    ],
  });

  // -----------------------------------------------------
  // ACTIVO EMPRESA 1
  // -----------------------------------------------------

  await prisma.asset.create({
    data: {
      name: 'Laptop Dell',
      type: 'Laptop',
      brand: 'Dell',
      model: 'Latitude 5420',
      serial: 'DL-123456',
      purchaseDate: new Date('2024-01-10'),
      cost: 1350000,
      companyId: company1.id,
      branchId: branch1.id,
      detail: {
        create: {
          ram_type: 'DDR4',
          ram_capacity: '16GB',
          hdd_type: 'SSD',
          hdd_capacity: '512GB',
          pro_type: 'Intel',
          pro_detail: 'i5 11th Gen',
          mbr_type: 'Dell',
          mbr_detail: 'OEM',
          gra_type: 'Intel',
          gra_detail: 'UHD Graphics',
          monitor: '14"',
          mon_detail: 'Full HD',
          keyboard: 'QWERTY',
          key_detail: 'Retroiluminado',
          mouse: 'Externo',
          mou_detail: 'USB',
        },
      },
    },
  });

  // -----------------------------------------------------
  // TICKETS EMPRESA 1
  // -----------------------------------------------------

  await prisma.ticket.createMany({
    data: [
      {
        title: 'No enciende el equipo',
        status: 'OPEN',
        companyId: company1.id,
      },
      {
        title: 'Problema con correo',
        status: 'CLOSED',
        companyId: company1.id,
      },
    ],
  });

  // -----------------------------------------------------
  // TAREAS EMPRESA 1
  // -----------------------------------------------------

  const admin1 = await prisma.user.findUnique({
    where: {
      email: 'admin@empresa1.demo',
    },
  });

  if (admin1) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Configurar Laptop Nueva',
          description: 'Configuración equipo nuevo',
          status: 'OPEN',
          priority: 'HIGH',
          companyId: company1.id,
          createdById: admin1.id,
        },
        {
          title: 'Actualizar antivirus',
          description: 'Equipo gerencia',
          status: 'DONE',
          priority: 'MEDIUM',
          companyId: company1.id,
          createdById: admin1.id,
        },
      ],
    });
  }

  // =====================================================
  // EMPRESA 2
  // =====================================================

  // -----------------------------------------------------
  // SEDE
  // -----------------------------------------------------

  const branch2 = await prisma.branch.create({
    data: {
      code: 'MAIN',
      name: 'Sede Principal',
      address: 'Carrera 45 #12-89',
      email: 'principal@empresa2.demo',
      companyId: company2.id,
    },
  });

  // -----------------------------------------------------
  // ADMIN EMPRESA 2
  // -----------------------------------------------------

  await prisma.user.create({
    data: {
      code: 'ADMIN2',
      name: 'Administrador Empresa 2',
      email: 'admin@empresa2.demo',
      password: adminPassword,
      companyId: company2.id,
      roleId: adminRole2.id,
    },
  });

  // -----------------------------------------------------
  // USER EMPRESA 2
  // -----------------------------------------------------

  await prisma.user.create({
    data: {
      code: 'USER2',
      name: 'Usuario Empresa 2',
      email: 'user@empresa2.demo',
      password: userPassword,
      companyId: company2.id,
      roleId: userRole2.id,
    },
  });

  // -----------------------------------------------------
  // EMPLEADOS EMPRESA 2
  // -----------------------------------------------------

  await prisma.employee.createMany({
    data: [
      {
        name: 'Carlos Ramírez',
        position: 'Bodeguero',
        email: 'carlos@empresa2.demo',
        companyId: company2.id,
        branchId: branch2.id,
      },
      {
        name: 'Laura Martínez',
        position: 'Contadora',
        email: 'laura@empresa2.demo',
        companyId: company2.id,
        branchId: branch2.id,
      },
    ],
  });

  // -----------------------------------------------------
  // ACTIVO EMPRESA 2
  // -----------------------------------------------------

  await prisma.asset.create({
    data: {
      name: 'Impresora HP',
      type: 'Impresora',
      brand: 'HP',
      model: 'LaserJet Pro M404',
      serial: 'HP-987654',
      purchaseDate: new Date('2024-03-15'),
      cost: 950000,
      companyId: company2.id,
      branchId: branch2.id,
    },
  });

  // -----------------------------------------------------
  // TICKETS EMPRESA 2
  // -----------------------------------------------------

  await prisma.ticket.createMany({
    data: [
      {
        title: 'Impresora no imprime',
        status: 'OPEN',
        companyId: company2.id,
      },
      {
        title: 'Actualización sistema contable',
        status: 'IN_PROGRESS',
        companyId: company2.id,
      },
    ],
  });

  // -----------------------------------------------------
  // TAREAS EMPRESA 2
  // -----------------------------------------------------

  const admin2 = await prisma.user.findUnique({
    where: {
      email: 'admin@empresa2.demo',
    },
  });

  if (admin2) {
    await prisma.task.createMany({
      data: [
        {
          title: 'Revisar inventario',
          description: 'Revisión Stock Bodega 1',
          status: 'OPEN',
          priority: 'HIGH',
          companyId: company2.id,
          createdById: admin2.id,
        },
        {
          title: 'Instalar drivers impresora',
          description: 'Instalar impresora nueva área de ventas',
          status: 'DONE',
          priority: 'MEDIUM',
          companyId: company2.id,
          createdById: admin2.id,
        },
      ],
    });
  }

  // =====================================================
  // RESUMEN
  // =====================================================

  console.log('');
  console.log('==========================================');
  console.log('✅ SEED COMPLETADO');
  console.log('==========================================');
  console.log('');
  console.log('ROLES');
  console.log('SOPORTE → Todos los permisos');
  console.log('ADMIN   → Módulos operativos completos');
  console.log('USER    → read + create + update');
  console.log('');
  console.log('USUARIOS');
  console.log('Soporte: soporte@system.com / Soporte123');
  console.log('Empresa 1 Admin: admin@empresa1.demo / Admin123');
  console.log('Empresa 1 User:  user@empresa1.demo / User123');
  console.log('Empresa 2 Admin: admin@empresa2.demo / Admin123');
  console.log('Empresa 2 User:  user@empresa2.demo / User123');
  console.log('');
  console.log('EMPRESAS');
  console.log('1. EMPRESA1 S.A.S');
  console.log('2. EMPRESA2 S.A.S');
  console.log('');
  console.log('==========================================');
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando seed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
