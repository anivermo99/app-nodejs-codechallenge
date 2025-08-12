import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TRANSACTION_LIMIT, TransactionStatus } from './enums/transaction.enum';
import { CreatedTransactionInput } from './dtos/created-transaction.input';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  verifyTransaction(transaction: CreatedTransactionInput): void {
    try {
      const { transactionExternalId, value } = transaction;

      const verifiedTransaction = {
        transactionExternalId: transactionExternalId,
        status:
          value > TRANSACTION_LIMIT
            ? TransactionStatus.REJECTED
            : TransactionStatus.APPROVED,
      };

      const message = JSON.stringify(verifiedTransaction);

      this.kafkaService.emit('transaction.status.updated', message);
      Logger.log('Transaction verified', verifiedTransaction);
    } catch (error) {
      Logger.error('Error verifying transaction', error);
      throw error;
    }
  }
}
