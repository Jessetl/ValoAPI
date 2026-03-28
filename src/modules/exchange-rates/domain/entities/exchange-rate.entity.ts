import { BaseEntity } from '../../../../shared-kernel/domain/base-entity';

interface ExchangeRateProps {
  rateVesPerUsd: number;
  source: string;
  fetchedAt: Date;
}

export class ExchangeRate extends BaseEntity {
  readonly rateVesPerUsd: number;
  readonly source: string;
  readonly fetchedAt: Date;

  private constructor(id: string, props: ExchangeRateProps) {
    super(id);
    this.rateVesPerUsd = props.rateVesPerUsd;
    this.source = props.source;
    this.fetchedAt = props.fetchedAt;
  }

  static create(
    id: string,
    rateVesPerUsd: number,
    source: string,
  ): ExchangeRate {
    return new ExchangeRate(id, {
      rateVesPerUsd,
      source,
      fetchedAt: new Date(),
    });
  }

  static reconstitute(id: string, props: ExchangeRateProps): ExchangeRate {
    return new ExchangeRate(id, props);
  }

  /**
   * Convierte un monto VES a USD usando esta tasa.
   */
  convertVesToUsd(amountVes: number): number {
    if (this.rateVesPerUsd === 0) return 0;
    return amountVes / this.rateVesPerUsd;
  }
}
