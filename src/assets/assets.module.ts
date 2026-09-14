import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
