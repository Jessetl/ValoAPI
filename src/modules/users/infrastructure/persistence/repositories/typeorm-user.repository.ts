import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { UserPersistenceMapper } from '../mappers/user-persistence.mapper';
import { ConflictException } from '../../../../../shared-kernel/domain/exceptions/conflict.exception';

// PostgreSQL error codes
const PG_UNIQUE_VIOLATION = '23505';

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
    try {
      const saved = await this.ormRepository.save(orm);
      return UserPersistenceMapper.toDomain(saved);
    } catch (error) {
      // Transforma unique constraint violations de PostgreSQL en excepciones de dominio
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { code?: string }).code ===
          PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(`User with this data already exists`);
      }
      // Errores de DB inesperados (connection lost, timeout) suben al AllExceptionsFilter
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
