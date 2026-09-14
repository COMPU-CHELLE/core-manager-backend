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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';

@Controller('tasks')
@UseGuards(PermissionsGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Permissions('tasks.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('tasks.read')
  @Get('trash')
  findDeleted() {
    return this.service.findDeleted();
  }

  @Permissions('tasks.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('tasks.create')
  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Permissions('tasks.update')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @Permissions('tasks.softdelete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Permissions('tasks.delete')
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseIntPipe) id: number) {
    return this.service.hardRemove(id);
  }

  @Permissions('tasks.update')
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
