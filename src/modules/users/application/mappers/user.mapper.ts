import { User } from '../../domain/entities/user.entity.js';
import { UserResponseDto } from '../dtos/user-response.dto.js';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.firebaseUid = user.firebaseUid;
    dto.email = user.email;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
