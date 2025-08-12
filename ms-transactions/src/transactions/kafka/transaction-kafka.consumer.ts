import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTransactionFromEventCommand } from '../commands/update-transaction-from-event.command';
import type { UpdateTransactionEvent } from '../types/kafka-event.types';

@Controller()
export class TransactionKafkaConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('transaction.status.updated')
  async handleTransactionStatusUpdated(
    @Payload() payload: UpdateTransactionEvent,
  ) {
    Logger.log('Event received', payload);

    const { transactionExternalId, status } = payload;

    await this.commandBus.execute(
      new UpdateTransactionFromEventCommand(transactionExternalId, status),
    );
  }
}
