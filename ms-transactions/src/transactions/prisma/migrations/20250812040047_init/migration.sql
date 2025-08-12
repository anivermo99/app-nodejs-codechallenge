-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "accountExternalIdDebit" UUID NOT NULL,
    "accountExternalIdCredit" UUID NOT NULL,
    "transactionTypeId" INTEGER NOT NULL,
    "transactionStatusId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_statuses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_statuses_name_key" ON "public"."transaction_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_types_name_key" ON "public"."transaction_types"("name");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "public"."transaction_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_transactionStatusId_fkey" FOREIGN KEY ("transactionStatusId") REFERENCES "public"."transaction_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
