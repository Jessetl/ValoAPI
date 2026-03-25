import { DomainException } from './domain.exception.js';

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
