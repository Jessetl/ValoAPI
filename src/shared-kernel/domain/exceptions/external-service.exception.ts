import { DomainException } from './domain.exception.js';

export class ExternalServiceException extends DomainException {
  constructor(
    public readonly serviceName: string,
    message: string,
  ) {
    super(`${serviceName}: ${message}`);
  }
}
