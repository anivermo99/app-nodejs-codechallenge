import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '../enums/transaction.enum';

export const TransactionStatusMap = new Map<TransactionStatusEnum, string>([
  [TransactionStatusEnum.PENDING, 'Pending'],
  [TransactionStatusEnum.APPROVED, 'Approved'],
  [TransactionStatusEnum.REJECTED, 'Rejected'],
]);

export const TransactionTypeMap = new Map<TransactionTypeEnum, string>([
  [TransactionTypeEnum.STANDARD, 'Standard'],
  [TransactionTypeEnum.TRANSFER, 'Transfer'],
  [TransactionTypeEnum.DEBIT, 'Debit'],
]);
