import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared-kernel/application/use-case';
import type { IShoppingListRepository } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { SHOPPING_LIST_REPOSITORY } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { ShoppingListResponseDto } from '../dtos/shopping-list-response.dto';
import { ShoppingListMapper } from '../mappers/shopping-list.mapper';
import { ShoppingListNotFoundException } from '../../domain/exceptions/shopping-list-not-found.exception';

interface GetShoppingListByIdInput {
  listId: string;
  userId: string;
}

@Injectable()
export class GetShoppingListByIdUseCase implements UseCase<
  GetShoppingListByIdInput,
  ShoppingListResponseDto
> {
  constructor(
    @Inject(SHOPPING_LIST_REPOSITORY)
    private readonly shoppingListRepository: IShoppingListRepository,
  ) {}

  async execute(
    input: GetShoppingListByIdInput,
  ): Promise<ShoppingListResponseDto> {
    const list = await this.shoppingListRepository.findByIdAndUserId(
      input.listId,
      input.userId,
    );

    if (!list) {
      throw new ShoppingListNotFoundException(input.listId);
    }

    return ShoppingListMapper.toResponse(list);
  }
}
