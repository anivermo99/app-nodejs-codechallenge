import { Prisma } from '@prisma/client';

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    transactionStatus: {
      select: { name: true };
    };
    transactionType: {
      select: { name: true };
    };
  };
}>;
