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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
@UseGuards(PermissionsGuard)
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Permissions('invoices.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('invoices.read')
  @Get('trash')
  findDeleted() {
    return this.service.findDeleted();
  }

  @Permissions('invoices.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('invoices.create')
  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.service.create(dto);
  }

  @Permissions('invoices.softdelete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Permissions('invoices.delete')
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseIntPipe) id: number) {
    return this.service.hardRemove(id);
  }

  @Permissions('invoices.update')
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
