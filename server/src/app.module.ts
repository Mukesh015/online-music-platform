// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { MusicModule } from './music/music.module';
import { SignupModule } from './signup/signup.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { MiddlewareService } from './middleware/middleware.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), './src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    MusicModule,
    SignupModule,

    MyLoggerModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    
  ],
})
export class AppModule {
}
