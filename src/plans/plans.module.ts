import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ContextModule } from '../common/context/context.module';
import { PlansController } from './plans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
