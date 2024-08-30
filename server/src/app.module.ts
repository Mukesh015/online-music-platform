import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { MusicModule } from './music/music.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MiddlewareModule } from './middleware/middleware.module';

import { SignupService } from './signup/signup.service';
import { SignupModule } from './signup/signup.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

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
  }]), MiddlewareModule, SignupModule,
  //   GraphQLModule.forRoot<ApolloDriverConfig>({
  //     driver: ApolloDriver,
  //     playground: false,
  //   }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,

  }, SignupService],
})
export class AppModule { }
