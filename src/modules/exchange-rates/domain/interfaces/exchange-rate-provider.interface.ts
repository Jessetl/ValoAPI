import { ExchangeRate } from '../entities/exchange-rate.entity';

export const EXCHANGE_RATE_PROVIDER = Symbol('EXCHANGE_RATE_PROVIDER');

/**
 * Port para obtener la tasa de cambio vigente.
 * La implementacion puede ser una API externa, cache, BD, etc.
 */
export interface IExchangeRateProvider {
  getCurrent(): Promise<ExchangeRate>;
}
