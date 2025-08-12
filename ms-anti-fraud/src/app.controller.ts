import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreatedTransactionInput } from './dtos/created-transaction.input';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('transaction.created')
  verifyTransaction(@Payload() message: CreatedTransactionInput): void {
    Logger.log('Event received', message);
    this.appService.verifyTransaction(message);
  }
}
