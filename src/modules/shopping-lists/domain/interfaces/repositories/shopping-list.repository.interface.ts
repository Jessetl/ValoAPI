import { ShoppingList } from '../../entities/shopping-list.entity';

export const SHOPPING_LIST_REPOSITORY = Symbol('SHOPPING_LIST_REPOSITORY');

export interface IShoppingListRepository {
  findById(id: string): Promise<ShoppingList | null>;
  findByIdAndUserId(id: string, userId: string): Promise<ShoppingList | null>;
  findActiveByUserId(userId: string): Promise<ShoppingList[]>;
  save(shoppingList: ShoppingList): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
}
