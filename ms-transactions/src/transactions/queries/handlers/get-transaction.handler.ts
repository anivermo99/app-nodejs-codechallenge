import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from '../get-transaction.query';
import { TransactionService } from 'src/transactions/services/transaction.service';
import { TransactionResponse } from 'src/transactions/dtos/responses/transaction.response';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery>
{
  constructor(private readonly transactionService: TransactionService) {}

  async execute(query: GetTransactionQuery): Promise<TransactionResponse> {
    const transaction = await this.transactionService.findById(query.id);

    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transactionType.name,
      },
      transactionStatus: {
        name: transaction.transactionStatus.name,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
