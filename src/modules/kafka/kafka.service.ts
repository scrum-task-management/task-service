import {
  OnModuleDestroy,
  OnModuleInit,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { KAFKA_TOPIC_PRODUCER } from './dto/types';
import { AllExceptionsFilter } from 'src/configs/decorators/catchError';
import { ConfigService } from '@nestjs/config';

@Injectable()
@UseFilters(AllExceptionsFilter)
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private client: ClientKafka;

  constructor(private readonly configService: ConfigService) {
    this.setUpKafaClient();
  }

  private setUpKafaClient() {
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID');
    const brokers = this.configService.get<string>('KAFKA_BROKERS').split(',');
    const consumerId = this.configService.get<string>(
      'KAFKA_CONFIG.CONSUMER_ID',
    );

    this.client = new ClientKafka({
      client: {
        clientId,
        brokers,
      },
      consumer: {
        groupId: consumerId,
      },
    });
  }

  getKafkaClient(): ClientKafka {
    return this.client;
  }

  async onModuleInit() {
    const requestPatterns = Object.values(KAFKA_TOPIC_PRODUCER);

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  public async sendKafkaMessageAndGetResponse(
    topic: KAFKA_TOPIC_PRODUCER,
    data: any,
    key?: string,
  ): Promise<Observable<any>> {
    const result = await lastValueFrom(
      this.client.send(topic, {
        key: key,
        value: data,
      }),
    );
    return result;
  }

  public sendKafkaMessage(
    topic: KAFKA_TOPIC_PRODUCER,
    data: any,
    key?: string,
  ) {
    this.client.send(topic, {
      key: key,
      value: data,
    });
  }

  async sendNotification(): Promise<any> {
    return this.client.emit('notify', { notify: true });
  }
}
