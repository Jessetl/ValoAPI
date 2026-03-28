import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared-kernel/application/use-case';
import type { IShoppingListRepository } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { SHOPPING_LIST_REPOSITORY } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { ShoppingList } from '../../domain/entities/shopping-list.entity';
import { UpdateShoppingListDto } from '../dtos/update-shopping-list.dto';
import { ShoppingListResponseDto } from '../dtos/shopping-list-response.dto';
import { ShoppingListMapper } from '../mappers/shopping-list.mapper';
import { ShoppingListNotFoundException } from '../../domain/exceptions/shopping-list-not-found.exception';

interface UpdateShoppingListInput {
  listId: string;
  userId: string;
  dto: UpdateShoppingListDto;
}

@Injectable()
export class UpdateShoppingListUseCase implements UseCase<
  UpdateShoppingListInput,
  ShoppingListResponseDto
> {
  constructor(
    @Inject(SHOPPING_LIST_REPOSITORY)
    private readonly shoppingListRepository: IShoppingListRepository,
  ) {}

  async execute(
    input: UpdateShoppingListInput,
  ): Promise<ShoppingListResponseDto> {
    const existing = await this.shoppingListRepository.findByIdAndUserId(
      input.listId,
      input.userId,
    );

    if (!existing) {
      throw new ShoppingListNotFoundException(input.listId);
    }

    const updated = ShoppingList.reconstitute(existing.id, {
      userId: existing.userId,
      name: input.dto.name ?? existing.name,
      storeName:
        input.dto.storeName !== undefined
          ? input.dto.storeName
          : existing.storeName,
      status: existing.status,
      ivaEnabled: input.dto.ivaEnabled ?? existing.ivaEnabled,
      totalVes: existing.totalVes,
      totalUsd: existing.totalUsd,
      exchangeRateSnapshot: existing.exchangeRateSnapshot,
      createdAt: existing.createdAt,
      completedAt: existing.completedAt,
      items: existing.items,
    });

    const saved = await this.shoppingListRepository.save(updated);
    return ShoppingListMapper.toResponse(saved);
  }
}
