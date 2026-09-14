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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { RevealCredentialDto } from './dto/reveal-credential.dto';

@Controller('credentials')
@UseGuards(PermissionsGuard)
export class CredentialsController {
  constructor(private readonly service: CredentialsService) {}

  @Permissions('credentials.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permissions('credentials.read')
  @Get('trash')
  findDeleted() {
    return this.service.findDeleted();
  }

  @Permissions('credentials.read')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Permissions('credentials.reveal')
  @Post(':id/reveal')
  reveal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RevealCredentialDto,
  ) {
    return this.service.reveal(id, dto);
  }

  @Permissions('credentials.create')
  @Post()
  create(@Body() dto: CreateCredentialDto) {
    return this.service.create(dto);
  }

  @Permissions('credentials.update')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCredentialDto,
  ) {
    return this.service.update(id, dto);
  }

  @Permissions('credentials.softdelete')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Permissions('credentials.delete')
  @Delete(':id/hard')
  hardRemove(@Param('id', ParseIntPipe) id: number) {
    return this.service.hardRemove(id);
  }

  @Permissions('credentials.update')
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
