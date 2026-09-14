import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { ContextModule } from './common/context/context.module';
import { EncryptionModule } from './common/crypto/encryption.module';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';
import { RolesGuard } from './auth/strategies/roles.guard';
import { PermissionsGuard } from './common/permissions/permissions.guard';
import { ContextGuard } from './common/context/context.guard';

import { AuditInterceptor } from './common/interceptors/audit.interceptor';

import { DashboardModule } from './dashboard/dashboard.module';
import { AssetsModule } from './assets/assets.module';
import { AssetAssignmentsModule } from './asset-assignments/asset-assignments.module';
import { MaintenancesModule } from './maintenances/maintenances.module';
import { AuditModule } from './audit/audit.module';
import { BranchesModule } from './branches/branches.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PlansModule } from './plans/plans.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { CredentialsModule } from './credentials/credentials.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    ContextModule,
    EncryptionModule,
    AuthModule,

    DashboardModule,

    AssetsModule,
    AssetAssignmentsModule,
    MaintenancesModule,

    AuditModule,
    BranchesModule,
    CompaniesModule,
    EmployeesModule,
    InvoicesModule,
    PlansModule,
    RolesModule,
    TasksModule,
    UsersModule,
    TicketsModule,
    CredentialsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ContextGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },

    PermissionsGuard,
  ],
})
export class AppModule {}
