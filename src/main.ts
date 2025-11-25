import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastucutre/config/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ENV } from './constants/env';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(ENV.port ?? 3000);
}
bootstrap();
