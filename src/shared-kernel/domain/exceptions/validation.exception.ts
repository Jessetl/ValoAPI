import { DomainException } from './domain.exception.js';

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
