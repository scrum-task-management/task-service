import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '@microservice-task/module-database/database.module';

import { SeederService } from './seeder.service';
import { ConfigModule } from '@microservice-task/module-config/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature()],
  providers: [SeederService, Logger],
})
export class SeederModule {}
