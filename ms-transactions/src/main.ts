import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { formatErrors } from './transactions/utils/format-errors.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors): Error => {
        return new BadRequestException(formatErrors(errors));
      },
    }),
  );

  await app.listen(Number(process.env.PORT ?? 3000));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER ?? 'localhost:9093'],
      },
      consumer: {
        groupId:
          process.env.KAFKA_CONSUMER_GROUP ?? 'transaction-service-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  console.log('HTTP server listening on 3000 and Kafka microservice started');
}

void bootstrap();
