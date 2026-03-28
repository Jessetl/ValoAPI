import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared-kernel/application/use-case';
import type { IShoppingListRepository } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { SHOPPING_LIST_REPOSITORY } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { ShoppingListResponseDto } from '../dtos/shopping-list-response.dto';
import { ShoppingListMapper } from '../mappers/shopping-list.mapper';

@Injectable()
export class GetShoppingListsUseCase implements UseCase<
  string,
  ShoppingListResponseDto[]
> {
  constructor(
    @Inject(SHOPPING_LIST_REPOSITORY)
    private readonly shoppingListRepository: IShoppingListRepository,
  ) {}

  async execute(userId: string): Promise<ShoppingListResponseDto[]> {
    const lists = await this.shoppingListRepository.findActiveByUserId(userId);
    return lists.map((list) => ShoppingListMapper.toResponse(list));
  }
}
