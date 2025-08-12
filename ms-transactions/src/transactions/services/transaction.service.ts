/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionStatusEnum } from '../enums/transaction.enum';
import { TransactionWithRelations } from '../types/transaction.types';
import { CreateTransactionModel } from '../dtos/models/create-transaction.model';
import { ClientKafka } from '@nestjs/microservices';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  TransactionStatusMap,
  TransactionTypeMap,
} from '../constants/transaction.constant';
import { UpdateTransactionStatusModel } from '../dtos/models/update-transaction-status.model';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  async create(data: CreateTransactionModel): Promise<Transaction> {
    const transaction = {
      accountExternalIdDebit: data.accountExternalIdDebit,
      accountExternalIdCredit: data.accountExternalIdCredit,
      transactionTypeId: data.transactionTypeId,
      transactionStatusId: TransactionStatusEnum.PENDING,
      value: data.value,
    };

    const transactionCreated =
      await this.transactionRepository.create(transaction);

    this.kafkaService.emit(
      'transaction.created',
      JSON.stringify({
        transactionExternalId: transactionCreated.id,
        value: transaction.value,
      }),
    );

    return transactionCreated;
  }

  async findById(id: string): Promise<TransactionWithRelations> {
    const cachedTransaction = (await this.cacheService.get(id)) as Transaction;

    if (cachedTransaction) {
      return {
        id: cachedTransaction.id,
        transactionStatus: {
          name: TransactionStatusMap.get(cachedTransaction.transactionStatusId),
        },
        transactionType: {
          name: TransactionTypeMap.get(cachedTransaction.transactionTypeId),
        },
        value: cachedTransaction.value,
        createdAt: new Date(cachedTransaction.createdAt),
      } as TransactionWithRelations;
    }

    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await this.cacheService.set(id, transaction);

    return transaction;
  }

  async updateStatusWithOCC(data: UpdateTransactionStatusModel): Promise<void> {
    const transaction = await this.transactionRepository.findById(data.id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    //Idempotency check
    if (transaction.transactionStatusId === (data.status as number)) {
      return;
    }

    //Optimistic Concurrency Control
    const updated = await this.transactionRepository.updateMany(
      {
        id: data.id,
        version: transaction.version,
      },
      {
        transactionStatusId: data.status,
        version: transaction.version + 1,
      },
    );

    if (!updated.count) {
      throw new Error('Transaction not updated');
    }

    transaction.transactionStatusId = data.status;
    await this.cacheService.set(transaction.id, transaction);
  }
}
