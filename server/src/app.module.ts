import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'), // Adjust the path if needed
      playground: process.env.NODE_ENV !== 'production',
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
export class AppModule {}
