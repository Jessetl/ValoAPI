import { DomainException } from './domain.exception.js';

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}
