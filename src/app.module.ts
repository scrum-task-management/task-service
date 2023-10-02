import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KafkaModule } from '@microservice-task/module-kafka/kafka.module';

import { DatabaseModule } from '@microservice-task/module-database/database.module';
import { AuthModule } from '@microservice-task/module-auth/auth.module';
import { ConfigModule } from '@microservice-task/module-config/config.module';
import { TransformInterceptor } from '@microservice-task/config-interceptors';
import { AllExceptionsFilter } from '@microservice-task/config-exceptions';
import { LoggerModule } from '@microservice-task/module-log/logs.module';
import LoggerMiddleware from '@microservice-task/config-middlewares/logger.middleware';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [
    AuthModule,
    LoggerModule,
    KafkaModule,
    ConfigModule,
    DatabaseModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
