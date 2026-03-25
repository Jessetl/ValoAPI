import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UseCase } from '../../../../shared-kernel/application/use-case.js';
import type { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface.js';
import { USER_REPOSITORY } from '../../domain/interfaces/repositories/user.repository.interface.js';
import { User } from '../../domain/entities/user.entity.js';
import { SyncUserDto } from '../dtos/sync-user.dto.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';
import { UserMapper } from '../mappers/user.mapper.js';

@Injectable()
export class SyncFirebaseUserUseCase implements UseCase<
  SyncUserDto,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: SyncUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByFirebaseUid(
      input.firebaseUid,
    );

    if (existing) {
      return UserMapper.toResponse(existing);
    }

    const user = User.create(randomUUID(), input.firebaseUid, input.email);
    const saved = await this.userRepository.save(user);
    return UserMapper.toResponse(saved);
  }
}
