import { ConflictException } from '../../../../shared-kernel/domain/exceptions/conflict.exception';

export class UserAlreadyExistsException extends ConflictException {
  constructor(firebaseUid: string) {
    super(`User with Firebase UID "${firebaseUid}" already exists`);
  }
}
