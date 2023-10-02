import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [
    configService.get('NODE_ENV') === 'production'
      ? 'dist/**/*.entity.js'
      : 'src/entities/*.entity{.ts,.js}',
  ],
  migrations: [
    configService.get('NODE_ENV') === 'production'
      ? 'dist/src/migrations/**/*.js'
      : 'src/migrations/*{.ts,.js}',
  ],
};

export default new DataSource(typeOrmConfig);
