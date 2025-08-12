import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Transaction } from '@prisma/client';

@ObjectType()
export class CreateTransactionResponse {
  @Field(() => String, { nullable: true })
  transactionExternalId: Transaction[`id`];

  @Field(() => String, { nullable: true })
  accountExternalIdDebit: Transaction[`accountExternalIdDebit`];

  @Field(() => String, { nullable: true })
  accountExternalIdCredit: Transaction[`accountExternalIdCredit`];

  @Field(() => Int, { nullable: true })
  transactionTypeId: Transaction[`transactionTypeId`];

  @Field(() => Int, { nullable: true })
  transactionStatusId: Transaction[`transactionStatusId`];

  @Field(() => Number, { nullable: true })
  value: Transaction[`value`];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
}
