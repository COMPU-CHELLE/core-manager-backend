import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📊 Verificando datos en la BD...\n');

    // Usuarios
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        company: true,
      },
    });

    console.log('👥 Usuarios:');
    console.log(JSON.stringify(users, null, 2));
    console.log(`Total: ${users.length}\n`);

    // Empresas
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { users: true, roles: true },
        },
      },
    });

    console.log('🏢 Empresas:');
    console.log(JSON.stringify(companies, null, 2));
    console.log(`Total: ${companies.length}\n`);

    // Roles
    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true, permissions: true },
        },
      },
    });

    console.log('👑 Roles:');
    console.log(JSON.stringify(roles, null, 2));
    console.log(`Total: ${roles.length}\n`);

    // Permisos
    const permissions = await prisma.permission.findMany({
      take: 10,
    });

    console.log('🔐 Permisos (primeros 10):');
    console.log(JSON.stringify(permissions, null, 2));

    const totalPerms = await prisma.permission.count();
    console.log(`Total permisos: ${totalPerms}\n`);

    if (users.length === 0) {
      console.log(
        '⚠️  No hay usuarios. Necesitas ejecutar: npm run prisma:seed',
      );
    } else {
      console.log('✅ Los datos están listos. Usa estos credenciales:\n');
      users.forEach((user) => {
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Contraseña: (la que configuraste en seed.ts)`);
        console.log(`👑 Rol: ${user.role.code}`);
        console.log(`🏢 Empresa: ${user.company?.name}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
