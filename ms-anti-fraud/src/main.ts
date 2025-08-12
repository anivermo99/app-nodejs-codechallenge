import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER ?? 'localhost:9093'],
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_GROUP ?? 'anti-fraud-consumer',
        },
      },
    },
  );

  await app.listen();

  console.log('Kafka microservice started');
}
void bootstrap();
