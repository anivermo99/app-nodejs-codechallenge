import { TransactionStatusEnum } from 'src/transactions/enums/transaction.enum';

export interface UpdateTransactionStatusModel {
  id: string;
  status: TransactionStatusEnum;
}
