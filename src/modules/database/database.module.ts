import { IConfig } from 'config';

import { ConfigModule } from '@microservice-task/module-config/config.module';
import { CONFIG } from '@microservice-task/module-config/config.provider';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: (configService: IConfig) => ({
        ...configService.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          database: string;
        }>('postgresql'),
        type: 'postgres',
        entities: ['dist/**/*.entity.js'],
        synchronize:
          configService.get<string>('env') === 'production' ? false : true,
        log:
          configService.get<string>('env') === 'production'
            ? ['warn', 'error']
            : true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
