import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Cấu hình CORS
  app.enableCors({
    origin: 'https://tiembanhbucker.netlify.app', // Địa chỉ frontend được phép
    methods: 'GET,POST,PUT,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Nếu cần cookie hoặc xác thực
  });

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('e-commerce-be')
    .setDescription('e-commerce-be API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start server
  await app.listen(process.env.NODE_PORT || 3001); // Mặc định chạy trên cổng 3001
}
bootstrap();
