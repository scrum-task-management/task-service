import { Module } from '@nestjs/common';
import { IConfig } from 'config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ConfigModule } from '@microservice-task/module-config/config.module';
import { CONFIG } from '@microservice-task/module-config/config.provider';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: (configService: IConfig) => ({
        node: configService.get('elasticsearch.node'),
        auth: {
          ...configService.get('elasticsearch.auth'),
        },
      }),
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
