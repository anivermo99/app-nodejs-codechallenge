import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@ArgsType()
export class GetTransactionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;
}
