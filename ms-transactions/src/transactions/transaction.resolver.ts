import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './commands/create-transaction.command';
import { GetTransactionQuery } from './queries/get-transaction.query';
import { CreateTransactionResponse } from './dtos/responses/create-transaction.response';
import { CreateTransactionInput } from './dtos/inputs/create-transaction.input';
import { TransactionResponse } from './dtos/responses/transaction.response';
import { GetTransactionInput } from './dtos/inputs/get-transaction.input';

@Resolver(() => TransactionResponse)
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => CreateTransactionResponse)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<CreateTransactionResponse> {
    return await this.commandBus.execute(
      new CreateTransactionCommand(
        input.accountExternalIdDebit,
        input.accountExternalIdCredit,
        input.transferTypeId,
        input.value,
      ),
    );
  }

  @Query(() => TransactionResponse)
  async getTransaction(
    @Args() input: GetTransactionInput,
  ): Promise<TransactionResponse> {
    return await this.queryBus.execute(
      new GetTransactionQuery(input.transactionExternalId),
    );
  }
}
