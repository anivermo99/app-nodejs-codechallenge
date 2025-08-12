import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../create-transaction.command';
import { TransactionService } from 'src/transactions/services/transaction.service';
import { CreateTransactionResponse } from 'src/transactions/dtos/responses/create-transaction.response';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly transactionService: TransactionService) {}

  async execute(
    command: CreateTransactionCommand,
  ): Promise<CreateTransactionResponse> {
    const transaction = await this.transactionService.create({
      accountExternalIdDebit: command.accountExternalIdDebit,
      accountExternalIdCredit: command.accountExternalIdCredit,
      transactionTypeId: command.transferTypeId,
      value: command.value,
    });

    return {
      transactionExternalId: transaction.id,
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      transactionTypeId: transaction.transactionTypeId,
      transactionStatusId: transaction.transactionStatusId,
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
