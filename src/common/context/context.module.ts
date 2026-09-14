import { Module } from '@nestjs/common';
import { RequestContext } from './request-context';
import { ContextGuard } from './context.guard';

@Module({
  providers: [RequestContext, ContextGuard],
  exports: [RequestContext],
})
export class ContextModule {}
