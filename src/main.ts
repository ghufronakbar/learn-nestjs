import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastucutre/config/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ENV } from './constants/env';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(ENV.port ?? 3000);
}
bootstrap();
