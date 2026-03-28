import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IShoppingListRepository } from '../../../domain/interfaces/repositories/shopping-list.repository.interface';
import { ShoppingList } from '../../../domain/entities/shopping-list.entity';
import { ShoppingListStatus } from '../../../domain/enums/shopping-list-status.enum';
import { ShoppingListOrmEntity } from '../orm-entities/shopping-list.orm-entity';
import { ShoppingListPersistenceMapper } from '../mappers/shopping-list-persistence.mapper';

@Injectable()
export class TypeOrmShoppingListRepository implements IShoppingListRepository {
  constructor(
    @InjectRepository(ShoppingListOrmEntity)
    private readonly ormRepository: Repository<ShoppingListOrmEntity>,
  ) {}

  async findById(id: string): Promise<ShoppingList | null> {
    const orm = await this.ormRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    return orm ? ShoppingListPersistenceMapper.toDomain(orm) : null;
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<ShoppingList | null> {
    const orm = await this.ormRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });
    return orm ? ShoppingListPersistenceMapper.toDomain(orm) : null;
  }

  async findActiveByUserId(userId: string): Promise<ShoppingList[]> {
    const orms = await this.ormRepository.find({
      where: { userId, status: ShoppingListStatus.ACTIVE },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => ShoppingListPersistenceMapper.toDomain(orm));
  }

  async save(shoppingList: ShoppingList): Promise<ShoppingList> {
    const orm = ShoppingListPersistenceMapper.toOrm(shoppingList);
    const saved = await this.ormRepository.save(orm);

    // Reload con relaciones para devolver items completos
    const reloaded = await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: ['items'],
    });

    return ShoppingListPersistenceMapper.toDomain(reloaded!);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
