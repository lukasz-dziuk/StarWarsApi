import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { StarWarsAppModule } from './startWars/startWarsApp.module';

async function bootstrap() {
  const app = await NestFactory.create(StarWarsAppModule.forRoot(false))
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  app.setGlobalPrefix('starWars')

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription('Star Wars CRUD API')
    .setVersion('1.0')
    .build()

  const doc = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, doc)

  await app.listen(process.env.SERVER_PORT ?? 3000)
}
bootstrap();
