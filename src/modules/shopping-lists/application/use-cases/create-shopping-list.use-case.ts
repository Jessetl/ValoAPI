import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UseCase } from '../../../../shared-kernel/application/use-case';
import type { IShoppingListRepository } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import { SHOPPING_LIST_REPOSITORY } from '../../domain/interfaces/repositories/shopping-list.repository.interface';
import type { IExchangeRateProvider } from '../../../exchange-rates/domain/interfaces/exchange-rate-provider.interface';
import { EXCHANGE_RATE_PROVIDER } from '../../../exchange-rates/domain/interfaces/exchange-rate-provider.interface';
import { ShoppingList } from '../../domain/entities/shopping-list.entity';
import { ShoppingItem } from '../../domain/entities/shopping-item.entity';
import { CreateShoppingListDto } from '../dtos/create-shopping-list.dto';
import { ShoppingListResponseDto } from '../dtos/shopping-list-response.dto';
import { ShoppingListMapper } from '../mappers/shopping-list.mapper';

interface CreateShoppingListInput {
  userId: string;
  dto: CreateShoppingListDto;
}

@Injectable()
export class CreateShoppingListUseCase implements UseCase<
  CreateShoppingListInput,
  ShoppingListResponseDto
> {
  constructor(
    @Inject(SHOPPING_LIST_REPOSITORY)
    private readonly shoppingListRepository: IShoppingListRepository,
    @Inject(EXCHANGE_RATE_PROVIDER)
    private readonly exchangeRateProvider: IExchangeRateProvider,
  ) {}

  async execute(
    input: CreateShoppingListInput,
  ): Promise<ShoppingListResponseDto> {
    const listId = randomUUID();

    // Obtener tasa vigente para conversion automatica VES → USD
    const exchangeRate = await this.exchangeRateProvider.getCurrent();
    const rateVesPerUsd = exchangeRate.rateVesPerUsd;

    const items = (input.dto.items ?? []).map((itemDto) =>
      ShoppingItem.create(
        randomUUID(),
        listId,
        itemDto.productName,
        itemDto.unitPriceVes,
        itemDto.quantity ?? 1,
        itemDto.unitPriceUsd ?? null,
        rateVesPerUsd,
      ),
    );

    const list = ShoppingList.create(
      listId,
      input.userId,
      input.dto.name,
      input.dto.storeName ?? null,
      input.dto.ivaEnabled ?? false,
      items,
      rateVesPerUsd,
    );

    const saved = await this.shoppingListRepository.save(list);
    return ShoppingListMapper.toResponse(saved);
  }
}
