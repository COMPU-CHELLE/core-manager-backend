import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { Permissions } from '../common/permissions/permissions.decorator';
import { PermissionsGuard } from '../common/permissions/permissions.guard';

@Controller('dashboard')
@UseGuards(PermissionsGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  // 📌 KPIs principales
  @Permissions('dashboard.read')
  @Get('overview')
  overview() {
    return this.service.overview();
  }

  // 📊 Gráficas
  @Permissions('dashboard.read')
  @Get('charts')
  charts(@Query() filters: DashboardFilterDto) {
    return this.service.billingCharts(filters.year);
  }

  // 🧾 Datos recientes
  @Permissions('dashboard.read')
  @Get('recent')
  recent() {
    return this.service.recent();
  }

  // 👑 Super admin
  @Permissions('dashboard.read')
  @Get('super-admin')
  superAdmin() {
    return this.service.superAdmin();
  }
}
