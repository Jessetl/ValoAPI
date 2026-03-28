import { Module } from '@nestjs/common';
import { EXCHANGE_RATE_PROVIDER } from './domain/interfaces/exchange-rate-provider.interface';
import { DolarApiExchangeRateProvider } from './infrastructure/providers/dolar-api-exchange-rate.provider';
import { GetCurrentExchangeRateUseCase } from './application/use-cases/get-current-exchange-rate.use-case';
import { ExchangeRatesController } from './infrastructure/controllers/exchange-rates.controller';

@Module({
  controllers: [ExchangeRatesController],
  providers: [
    {
      provide: EXCHANGE_RATE_PROVIDER,
      useClass: DolarApiExchangeRateProvider,
    },
    GetCurrentExchangeRateUseCase,
  ],
  exports: [EXCHANGE_RATE_PROVIDER],
})
export class ExchangeRatesModule {}
