import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from '../common/permissions/permissions.decorator';
import { PermissionsGuard } from '../common/permissions/permissions.guard';
import { AssetAssignmentsService } from './asset-assignments.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { ReturnAssetDto } from './dto/return-asset.dto';
import { Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('asset-assignments')
@UseGuards(PermissionsGuard)
export class AssetAssignmentsController {
  constructor(private readonly service: AssetAssignmentsService) {}

  @Permissions('asset_assignments.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('asset_assignments.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('asset_assignments.create')
  @Post()
  assign(@Body() dto: CreateAssetAssignmentDto) {
    return this.service.assign(dto);
  }

  @Permissions('asset_assignments.update')
  @Patch(':id/return')
  returnAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReturnAssetDto,
  ) {
    return this.service.returnAsset(id, dto.returnedAt);
  }

  @Permissions('asset_assignments.read')
  @Get(':id/document')
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const pdf = await this.service.generatePdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=asignacion_${id}.pdf`,
    );

    res.send(pdf);
  }
}
