import { Module } from '@nestjs/common';
import { MiddlewareService } from './middleware.service';
import { MiddlewareController } from './middleware.controller';

@Module({
  providers: [MiddlewareService],
  controllers: [MiddlewareController]
})
export class MiddlewareModule {}
