import { DomainException } from './domain.exception.js';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`);
  }
}
