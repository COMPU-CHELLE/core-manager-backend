import { Module } from '@nestjs/common';
import { ContextModule } from 'src/common/context/context.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
