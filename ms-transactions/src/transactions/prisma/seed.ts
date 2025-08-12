import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  //Transaction Types
  await prisma.transactionType.createMany({
    data: [{ name: 'Standard' }, { name: 'Transfer' }, { name: 'Debit' }],
    skipDuplicates: true,
  });

  //Transaction Status
  await prisma.transactionStatus.createMany({
    data: [{ name: 'Pending' }, { name: 'Approved' }, { name: 'Rejected' }],
    skipDuplicates: true,
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
