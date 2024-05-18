import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
    transform: true, // Habilita la transformación de los datos entrantes
    whitelist: true, // Elimina los valores no incluidos en las clases DTO
    forbidNonWhitelisted: true, // Lanza un error si se encuentran valores no permitidos
    }
  ));
  app.enableCors();

  // Swagger
  // Use DocumentBuilder to create a new Swagger document configuration
  const config = new DocumentBuilder()
    .setTitle('League of Token API')
    .setDescription("This is the League of Token API. It provides service to React frontend app, and uses Auth0 and MercadoPago services")
    .setVersion('0.1')
    .build(); // Build the document
  // Create a Swagger document using the application instance and the document configuration
  const document = SwaggerModule.createDocument(app, config);
  // Setup Swagger module (UI) with the application instance and the Swagger document
  SwaggerModule.setup('api', app, document);

  // CORS
  app.enableCors();
  
  // Init
  await app.listen(process.env.PORT);
}

bootstrap();
