import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { LoggerModule } from './modules/log/logs.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import { KafkaModule } from '@microservice-task/module-kafka/kafka.module';
import {
  KafkaConstants,
  ServerConstants,
} from '@microservice-task/config-constants';
import { DatabaseModule } from '@microservice-task/module-database/database.module';
import { AuthModule } from '@microservice-task/module-auth/auth.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    AuthModule,
    LoggerModule,
    KafkaModule,
    ConfigModule.forRoot({
      load: [KafkaConstants, ServerConstants],
      validationSchema: Joi.object({
        // PostgresQL
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        // Port server
        PORT: Joi.number(),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

        // Kafka broker
        KAFKA_BROKERS: Joi.string().required(),
        KAFKA_CLIENT_ID: Joi.string().required(),
      }),
    }),
    DatabaseModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
