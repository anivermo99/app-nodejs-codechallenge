import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionFromEventCommand } from '../update-transaction-from-event.command';
import { TransactionService } from 'src/transactions/services/transaction.service';

@CommandHandler(UpdateTransactionFromEventCommand)
export class UpdateTransactionFromEventHandler
  implements ICommandHandler<UpdateTransactionFromEventCommand>
{
  constructor(private readonly transactionService: TransactionService) {}

  async execute(command: UpdateTransactionFromEventCommand): Promise<void> {
    await this.transactionService.updateStatusWithOCC({
      id: command.transactionExternalId,
      status: command.status,
    });
  }
}
