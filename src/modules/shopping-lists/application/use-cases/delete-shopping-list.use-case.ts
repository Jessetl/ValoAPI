import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared-kernel/application/use-case';
import type { IShoppingListRepository } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { SHOPPING_LIST_REPOSITORY } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { ShoppingListNotFoundException } from '../../domain/exceptions/shopping-list-not-found.exception';
import { DeleteShoppingListResponseDto } from '../dtos/delete-shopping-list-response.dto';

interface DeleteShoppingListInput {
  listId: string;
  userId: string;
}

@Injectable()
export class DeleteShoppingListUseCase implements UseCase<
  DeleteShoppingListInput,
  DeleteShoppingListResponseDto
> {
  constructor(
    @Inject(SHOPPING_LIST_REPOSITORY)
    private readonly shoppingListRepository: IShoppingListRepository,
  ) {}

  async execute(
    input: DeleteShoppingListInput,
  ): Promise<DeleteShoppingListResponseDto> {
    const existing = await this.shoppingListRepository.findByIdAndUserId(
      input.listId,
      input.userId,
    );

    if (!existing) {
      throw new ShoppingListNotFoundException(input.listId);
    }

    await this.shoppingListRepository.delete(input.listId);

    return { message: 'Lista borrada exitosamente' };
  }
}
