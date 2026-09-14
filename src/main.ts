import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLogger } from './common/logger/app.logger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔐 Seguridad básica HTTP
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 🌍 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 🧪 Validación global profesional
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🛑 Filtro global de excepciones
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  // 📜 Logger personalizado
  app.useLogger(new AppLogger());

  // 📚 Swagger
  const config = new DocumentBuilder()
    .setTitle('SaaS API')
    .setDescription('Multi-tenant backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
