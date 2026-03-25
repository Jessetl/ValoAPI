import { ConflictException } from '../../../../shared-kernel/domain/exceptions/conflict.exception.js';

export class UserAlreadyExistsException extends ConflictException {
  constructor(firebaseUid: string) {
    super(`User with Firebase UID "${firebaseUid}" already exists`);
  }
}
