import { BaseEntity } from '../../../../shared-kernel/domain/base-entity';
import { ShoppingListStatus } from '../enums/shopping-list-status.enum';
import { ShoppingItem } from './shopping-item.entity';

interface ShoppingListProps {
  userId: string;
  name: string;
  storeName: string | null;
  status: ShoppingListStatus;
  ivaEnabled: boolean;
  totalVes: number;
  totalUsd: number;
  exchangeRateSnapshot: number | null;
  createdAt: Date;
  completedAt: Date | null;
  items: ShoppingItem[];
}

export class ShoppingList extends BaseEntity {
  readonly userId: string;
  readonly name: string;
  readonly storeName: string | null;
  readonly status: ShoppingListStatus;
  readonly ivaEnabled: boolean;
  readonly totalVes: number;
  readonly totalUsd: number;
  readonly exchangeRateSnapshot: number | null;
  readonly createdAt: Date;
  readonly completedAt: Date | null;
  readonly items: ShoppingItem[];

  private constructor(id: string, props: ShoppingListProps) {
    super(id);
    this.userId = props.userId;
    this.name = props.name;
    this.storeName = props.storeName;
    this.status = props.status;
    this.ivaEnabled = props.ivaEnabled;
    this.totalVes = props.totalVes;
    this.totalUsd = props.totalUsd;
    this.exchangeRateSnapshot = props.exchangeRateSnapshot;
    this.createdAt = props.createdAt;
    this.completedAt = props.completedAt;
    this.items = props.items;
  }

  static create(
    id: string,
    userId: string,
    name: string,
    storeName: string | null = null,
    ivaEnabled: boolean = false,
    items: ShoppingItem[] = [],
    exchangeRateSnapshot: number | null = null,
  ): ShoppingList {
    const totalVes = items.reduce((sum, item) => sum + item.totalVes, 0);
    const totalUsd = items.reduce((sum, item) => sum + (item.totalUsd ?? 0), 0);

    return new ShoppingList(id, {
      userId,
      name,
      storeName,
      status: ShoppingListStatus.ACTIVE,
      ivaEnabled,
      totalVes,
      totalUsd,
      exchangeRateSnapshot,
      createdAt: new Date(),
      completedAt: null,
      items,
    });
  }

  static reconstitute(id: string, props: ShoppingListProps): ShoppingList {
    return new ShoppingList(id, props);
  }
}
