import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Zen Task API')
    .setDescription('API для управления задачами и проектами')
    .setVersion('1.0')
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('projects', 'Управление проектами')
    .addTag('tasks', 'Управление задачами')
    .addTag('categories', 'Управление категориями')
    .addTag('markers', 'Управление маркерами')
    .addTag('contacts', 'Управление контактами')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Zen Task API Documentation',
  });
};
