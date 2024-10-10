import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TaskSchedulerConfig } from './task-scheduling/task-scheduling-config';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

    logger: ['log', 'debug', 'verbose'],
  })

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Prospera Tecnologia API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('Prospera Tecnologia')
    .build();

  app.enableCors()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const taskSchedulerConfig = app.get(TaskSchedulerConfig);
  taskSchedulerConfig.configure();

  await app.listen(port);

}

bootstrap()











