import { Module } from '@nestjs/common';
import { MiddlewareController } from './middleware.controller';
import { MiddlewareService } from './middleware.service';

@Module({
  controllers: [MiddlewareController],
  providers: [MiddlewareService]
})
export class MiddlewareModule {}
