import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '@microservice-task/module-config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
