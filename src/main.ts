//  nest
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// interceptors
import { FormatResponseInterceptor } from './common/interceptors';

// filters
import { FormatErrorFilter, PrismaFormatErrorFilter } from './common/filters';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1'); // for global prefix

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
        .setTitle('ACL')
        .setDescription('ACL API Service')
        .setVersion('1.0')
        .addTag('ACL')
        .build(),
    ),
  );

  await app.listen(process.env.PORT || process.env.APPLICATION_PORT || 3001);
}
bootstrap();
