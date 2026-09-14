import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [BranchesController],
  providers: [BranchesService],
})
export class BranchesModule {}
