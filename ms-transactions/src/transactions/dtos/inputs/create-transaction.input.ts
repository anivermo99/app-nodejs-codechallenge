import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionTypeEnum } from 'src/transactions/enums/transaction.enum';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @Field(() => String)
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @Field(() => Int)
  @IsEnum(TransactionTypeEnum)
  @IsNotEmpty()
  transferTypeId: TransactionTypeEnum;

  @Field(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  value: number;
}
