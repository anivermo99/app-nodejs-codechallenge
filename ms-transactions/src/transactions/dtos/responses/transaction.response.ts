import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Transaction } from '@prisma/client';
@ObjectType()
class TransactionType {
  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType()
class TransactionStatus {
  @Field(() => String, { nullable: true })
  name: string;
}

@ObjectType()
export class TransactionResponse {
  @Field(() => String, { nullable: true })
  transactionExternalId: Transaction[`id`];

  @Field({ nullable: true })
  transactionType: TransactionType;

  @Field({ nullable: true })
  transactionStatus: TransactionStatus;

  @Field(() => Number, { nullable: true })
  value: Transaction[`value`];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
}
