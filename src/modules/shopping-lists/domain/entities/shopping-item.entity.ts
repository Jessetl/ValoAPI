import { BaseEntity } from '../../../../shared-kernel/domain/base-entity';

interface ShoppingItemProps {
  listId: string;
  productName: string;
  unitPriceVes: number;
  quantity: number;
  totalVes: number;
  unitPriceUsd: number | null;
  totalUsd: number | null;
  isPurchased: boolean;
  createdAt: Date;
}

export class ShoppingItem extends BaseEntity {
  readonly listId: string;
  readonly productName: string;
  readonly unitPriceVes: number;
  readonly quantity: number;
  readonly totalVes: number;
  readonly unitPriceUsd: number | null;
  readonly totalUsd: number | null;
  readonly isPurchased: boolean;
  readonly createdAt: Date;

  private constructor(id: string, props: ShoppingItemProps) {
    super(id);
    this.listId = props.listId;
    this.productName = props.productName;
    this.unitPriceVes = props.unitPriceVes;
    this.quantity = props.quantity;
    this.totalVes = props.totalVes;
    this.unitPriceUsd = props.unitPriceUsd;
    this.totalUsd = props.totalUsd;
    this.isPurchased = props.isPurchased;
    this.createdAt = props.createdAt;
  }

  /**
   * @param unitPriceUsd Si es null y rateVesPerUsd esta disponible, se calcula automaticamente.
   * @param rateVesPerUsd Tasa VES/USD vigente para conversion automatica.
   */
  static create(
    id: string,
    listId: string,
    productName: string,
    unitPriceVes: number,
    quantity: number,
    unitPriceUsd: number | null = null,
    rateVesPerUsd: number | null = null,
  ): ShoppingItem {
    const totalVes = unitPriceVes * quantity;

    // Si no se envia USD pero hay tasa disponible, calcular automaticamente
    let resolvedUnitPriceUsd = unitPriceUsd;
    if (
      resolvedUnitPriceUsd === null &&
      rateVesPerUsd !== null &&
      rateVesPerUsd > 0
    ) {
      resolvedUnitPriceUsd = unitPriceVes / rateVesPerUsd;
    }

    const totalUsd =
      resolvedUnitPriceUsd !== null ? resolvedUnitPriceUsd * quantity : null;

    return new ShoppingItem(id, {
      listId,
      productName,
      unitPriceVes,
      quantity,
      totalVes,
      unitPriceUsd: resolvedUnitPriceUsd,
      totalUsd,
      isPurchased: false,
      createdAt: new Date(),
    });
  }

  static reconstitute(id: string, props: ShoppingItemProps): ShoppingItem {
    return new ShoppingItem(id, props);
  }
}
