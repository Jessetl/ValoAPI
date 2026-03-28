import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingListOrmEntity } from './shopping-list.orm-entity';

@Entity('shopping_items')
export class ShoppingItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'list_id', type: 'uuid' })
  listId: string;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column({
    name: 'unit_price_ves',
    type: 'decimal',
    precision: 18,
    scale: 2,
  })
  unitPriceVes: number;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({
    name: 'total_ves',
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
  })
  totalVes: number;

  @Column({
    name: 'unit_price_usd',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  unitPriceUsd: number | null;

  @Column({
    name: 'total_usd',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  totalUsd: number | null;

  @Column({ name: 'is_purchased', type: 'boolean', default: false })
  isPurchased: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => ShoppingListOrmEntity, (list) => list.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'list_id' })
  shoppingList: ShoppingListOrmEntity;
}
