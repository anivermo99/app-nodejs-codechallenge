export interface CreateTransactionModel {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId: number;
  value: number;
}
