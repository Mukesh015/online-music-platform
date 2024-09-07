import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './my-logger/my-logger.service';
import { AllExceptionsFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  const logger = app.get(MyLoggerService);

  app.setGlobalPrefix('api');
  app.useLogger(logger);


  app.useGlobalFilters(new AllExceptionsFilter(logger));
  const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['https://musicly-ktbt.vercel.app'];
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
}

bootstrap();
