import { NestFactory,HttpAdapterHost  } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const {httpAdapter}= app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://musicly-ktbt.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api')
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
}
bootstrap();
