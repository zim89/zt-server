import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { setupSwagger } from '@/shared/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser
  app.use(cookieParser());

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Настройка Swagger
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
