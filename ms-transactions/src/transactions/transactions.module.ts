import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './services/transaction.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { UpdateTransactionFromEventHandler } from './commands/handlers/update-transaction-from-event.handler';
import { TransactionKafkaConsumer } from './kafka/transaction-kafka.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GetTransactionHandler } from './queries/handlers/get-transaction.handler';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'transaction-service',
                brokers: [
                  configService.get<string>('KAFKA_BROKER') ?? 'localhost:9093',
                ],
              },
              consumer: {
                groupId:
                  configService.get<string>('KAFKA_CONSUMER_GROUP') ??
                  'transaction-service-consumer',
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [
    TransactionResolver,
    TransactionService,
    TransactionRepository,
    CreateTransactionHandler,
    UpdateTransactionFromEventHandler,
    GetTransactionHandler,
    TransactionKafkaConsumer,
  ],
  controllers: [TransactionKafkaConsumer],
})
export class TransactionsModule {}
