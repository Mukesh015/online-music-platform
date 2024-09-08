import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { readFileSync } from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema'; // Install @graphql-tools/schema if not already installed
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { MusicModule } from './music/music.module';
import { SignupModule } from './signup/signup.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { AuthguardModule } from './authguard/authguard.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Determine schema file path and load schema if in production
const schemaFilePath = process.env.NODE_ENV === 'production'
  ? join(process.cwd(), './src/schema.gql') // Path to your pre-generated schema in production
  : '';

const schema = schemaFilePath ? makeExecutableSchema({
  typeDefs: readFileSync(schemaFilePath, 'utf8'),
}) : undefined;

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.NODE_ENV === 'production' ? false : join(process.cwd(), './src/schema.gql'),
      schema: schema, 
      playground: process.env.NODE_ENV !== 'production', 
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    MusicModule,
    SignupModule,
    MyLoggerModule,
    MiddlewareModule,
    AuthguardModule,
    
  ],
  providers: [
    AppResolver,
    AppService
  ],
  controllers:[
    AppController
  ]
})
export class AppModule {}
