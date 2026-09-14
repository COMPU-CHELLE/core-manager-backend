import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../common/permissions/permissions.decorator';
import { PermissionsGuard } from '../common/permissions/permissions.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Permissions('roles.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('roles.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('roles.create')
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Permissions('roles.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Permissions('roles.delete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
  // ===============================
  // 🔐 PERMISSIONS
  // ===============================
  @Permissions('roles.permissions.read')
  @Get(':id/permissions')
  permissions(@Param('id', ParseIntPipe) id: number) {
    return this.service.listPermissions(id);
  }

  @Get('permissions/modules')
  listPermissionsByModule() {
    return this.service.listAllPermissionsByModule();
  }

  @Permissions('roles.permissions.update')
  @Put(':id/permissions')
  syncPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.service.syncPermissions(id, dto.permissionIds);
  }
}
