import { TransactionStatusEnum } from '../enums/transaction.enum';

export class UpdateTransactionFromEventCommand {
  constructor(
    public readonly transactionExternalId: string,
    public readonly status: TransactionStatusEnum,
  ) {}
}
