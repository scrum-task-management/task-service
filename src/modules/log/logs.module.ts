import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Log } from '@microservice-task/entities';

import LogsService from './logs.service';
import CustomLogger from './customLogger';
import { ConfigModule } from '@microservice-task/module-config/config.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [CustomLogger, LogsService],
  exports: [CustomLogger],
})
export class LoggerModule {}
