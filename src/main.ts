//  nest
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// env
import { ENV } from '@config/env';

// Third Party
import ExpressCookieParser from 'cookie-parser';

// interceptors
import { FormatResponseInterceptor } from './common/interceptors';

// filters
import { FormatErrorFilter, PrismaFormatErrorFilter } from './common/filters';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: '*',
  });

  app.setGlobalPrefix(ENV.APP_VERSION); // for global prefix
  app.use(ExpressCookieParser());
  app.useGlobalPipes(new ValidationPipe()); // Validation With DTOs'

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }), // for transformer
    new FormatResponseInterceptor(), // for final response transform
  );

  app.useGlobalFilters(new FormatErrorFilter(), new PrismaFormatErrorFilter()); // for formatting final error response

  // Setup Swagger
  SwaggerModule.setup(
    'swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('AUTH API Service')
        .setVersion('1.0')
        .addTag('AUTH')
        .addCookieAuth(ENV.APP_ACCESS_TOKEN)
        .build(),
    ),
  );

  await app.listen(process.env.PORT || ENV.APPLICATION_PORT || 3001);
}
bootstrap();
