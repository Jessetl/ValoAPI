import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface.js';
import { User } from '../../../domain/entities/user.entity.js';
import { UserOrmEntity } from '../orm-entities/user.orm-entity.js';
import { UserPersistenceMapper } from '../mappers/user-persistence.mapper.js';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? UserPersistenceMapper.toDomain(orm) : null;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const orm = await this.ormRepository.findOne({ where: { firebaseUid } });
    return orm ? UserPersistenceMapper.toDomain(orm) : null;
  }

  async save(user: User): Promise<User> {
    const orm = UserPersistenceMapper.toOrm(user);
    const saved = await this.ormRepository.save(orm);
    return UserPersistenceMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
