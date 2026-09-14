import { Module } from '@nestjs/common';
import { ContextModule } from 'src/common/context/context.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
