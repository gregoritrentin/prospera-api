import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/core/infra/module'
import { EnvService } from '@/core/infra/config/env.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'

require('events').EventEmitter.defaultMaxListeners = 20;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'verbose'],
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Prospera Tecnologia API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('Prospera Tecnologia')
    .build();

  app.enableCors();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

bootstrap();