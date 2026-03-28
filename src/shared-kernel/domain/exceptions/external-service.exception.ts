import { DomainException } from './domain.exception';

export class ExternalServiceException extends DomainException {
  constructor(
    public readonly serviceName: string,
    message: string,
  ) {
    super(`${serviceName}: ${message}`);
  }
}
