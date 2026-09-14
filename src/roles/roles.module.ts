import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContextModule } from 'src/common/context/context.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
