import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { TransactionWithRelations } from '../types/transaction.types';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.TransactionUncheckedCreateInput,
  ): Promise<Transaction> {
    return await this.prisma.transaction.create({ data });
  }

  async findById(id: string): Promise<TransactionWithRelations | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        transactionStatus: {
          select: { name: true },
        },
        transactionType: {
          select: { name: true },
        },
      },
    });

    return transaction;
  }

  async update(
    id: string,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Transaction | null> {
    return await this.prisma.transaction.update({ where: { id }, data });
  }

  async updateMany(
    where: Prisma.TransactionWhereInput,
    data: Prisma.TransactionUncheckedUpdateInput,
  ): Promise<Prisma.BatchPayload> {
    return await this.prisma.transaction.updateMany({ where, data });
  }
}
