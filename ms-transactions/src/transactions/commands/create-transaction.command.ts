import { TransactionTypeEnum } from '../enums/transaction.enum';

export class CreateTransactionCommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: TransactionTypeEnum,
    public readonly value: number,
  ) {}
}
