import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContextModule } from '../common/context/context.module';

@Module({
  imports: [PrismaModule, ContextModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
