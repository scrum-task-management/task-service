import * as dotenv from 'dotenv';
dotenv.config();

import { IConfig } from 'config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { TransformInterceptor } from '@microservice-task/config-interceptors';
import { AllExceptionsFilter } from '@microservice-task/config-exceptions';
import getLogLevels from '@microservice-task/utils/getLogLevels';
import CustomLogger from '@microservice-task/module-log/customLogger';
import { CONFIG } from '@microservice-task/module-config/config.provider';

async function bootstrap() {
  // Logger
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  const configService = app.get<IConfig>(CONFIG);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get<string>('kafka.kafka_client_id'),
        brokers: configService.get<string>('kafka.kafka_brokers').split(','),
      },
      consumer: {
        groupId: configService.get<string>('kafka.consumer_id'),
      },
    },
  });

  app.setGlobalPrefix(configService.get<string>('server.base_url'));

  app.useLogger(app.get(CustomLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // Catch exception
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API with NestJS')
    .setDescription('API developed throughout the API with NestJS course')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}

bootstrap();
