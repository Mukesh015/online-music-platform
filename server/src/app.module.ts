import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { MusicModule } from './music/music.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [DatabaseModule, MyLoggerModule, MusicModule, ThrottlerModule.forRoot([{
    name: 'short',
    ttl: 1000,
    limit: 3
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100
  }]), MiddlewareModule,],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,

  }],
})
export class AppModule { }
