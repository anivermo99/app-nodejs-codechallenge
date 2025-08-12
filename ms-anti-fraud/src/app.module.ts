import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'anti-fraud',
              brokers: [
                configService.get<string>('KAFKA_BROKER') ?? 'localhost:9093',
              ],
            },
            consumer: {
              groupId:
                configService.get<string>('KAFKA_CONSUMER_GROUP') ??
                'anti-fraud-consumer',
            },
          },
        }),
      },
    ]),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
