import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Test Técnico Gestión de Empleados')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token de sesión en este campo',
        in: 'header',
      },
      'jwt', 
    )
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); 

    app.enableCors({
      origin: 'http://localhost:5173', 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, 
    });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
