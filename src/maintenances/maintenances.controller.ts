import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../common/permissions/permissions.decorator';
import { PermissionsGuard } from '../common/permissions/permissions.guard';
import { MaintenancesService } from './maintenances.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Controller('maintenances')
@UseGuards(PermissionsGuard)
export class MaintenancesController {
  constructor(private readonly service: MaintenancesService) {}

  @Permissions('maintenances.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('maintenances.read')
  @Get('asset/:assetId')
  findByAsset(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.service.findByAsset(assetId);
  }

  @Permissions('maintenances.read')
  @Get('trash')
  findDeleted() {
    return this.service.findDeleted();
  }

  @Permissions('maintenances.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('maintenances.create')
  @Post()
  create(@Body() dto: CreateMaintenanceDto) {
    return this.service.create(dto);
  }

  @Permissions('maintenances.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Permissions('maintenances.softdelete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Permissions('maintenances.delete')
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseIntPipe) id: number) {
    return this.service.hardRemove(id);
  }

  @Permissions('maintenances.update')
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
