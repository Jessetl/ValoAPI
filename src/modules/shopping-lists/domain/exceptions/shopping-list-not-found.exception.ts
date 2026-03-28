import { NotFoundException } from '../../../../shared-kernel/domain/exceptions/not-found.exception';

export class ShoppingListNotFoundException extends NotFoundException {
  constructor(id: string) {
    super('ShoppingList', id);
  }
}
