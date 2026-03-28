import { ShoppingList } from '../../domain/entities/shopping-list.entity';
import { ShoppingItem } from '../../domain/entities/shopping-item.entity';
import { ShoppingListResponseDto } from '../dtos/shopping-list-response.dto';
import { ShoppingItemResponseDto } from '../dtos/shopping-item-response.dto';

export class ShoppingListMapper {
  static toResponse(list: ShoppingList): ShoppingListResponseDto {
    const dto = new ShoppingListResponseDto();
    dto.id = list.id;
    dto.userId = list.userId;
    dto.name = list.name;
    dto.storeName = list.storeName;
    dto.status = list.status;
    dto.ivaEnabled = list.ivaEnabled;
    dto.totalVes = list.totalVes;
    dto.totalUsd = list.totalUsd;
    dto.exchangeRateSnapshot = list.exchangeRateSnapshot;
    dto.createdAt = list.createdAt;
    dto.completedAt = list.completedAt;
    dto.items = list.items.map((item) => this.toItemResponse(item));
    return dto;
  }

  static toItemResponse(item: ShoppingItem): ShoppingItemResponseDto {
    const dto = new ShoppingItemResponseDto();
    dto.id = item.id;
    dto.listId = item.listId;
    dto.productName = item.productName;
    dto.unitPriceVes = item.unitPriceVes;
    dto.quantity = item.quantity;
    dto.totalVes = item.totalVes;
    dto.unitPriceUsd = item.unitPriceUsd;
    dto.totalUsd = item.totalUsd;
    dto.isPurchased = item.isPurchased;
    dto.createdAt = item.createdAt;
    return dto;
  }
}
