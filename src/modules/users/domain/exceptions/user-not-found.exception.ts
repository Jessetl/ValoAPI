import { NotFoundException } from '../../../../shared-kernel/domain/exceptions/not-found.exception';

export class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    super('User', id);
  }
}
