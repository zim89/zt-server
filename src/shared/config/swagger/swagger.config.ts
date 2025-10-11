import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiTagsMetadata } from '@/shared/constants';

export const setupSwagger = (app: INestApplication) => {
  const configBuilder = new DocumentBuilder()
    .setTitle('Zen Task API')
    .setDescription('API для управления задачами и проектами')
    .setVersion('1.0');

  // Add all API tags from metadata
  apiTagsMetadata.forEach((tag) => {
    configBuilder.addTag(tag.name, tag.description);
  });

  const config = configBuilder
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
