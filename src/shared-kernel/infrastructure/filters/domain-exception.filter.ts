import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception.js';
import { NotFoundException } from '../../domain/exceptions/not-found.exception.js';
import { ConflictException } from '../../domain/exceptions/conflict.exception.js';
import { ValidationException } from '../../domain/exceptions/validation.exception.js';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception.js';
import { ExternalServiceException } from '../../domain/exceptions/external-service.exception.js';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('DomainException');

  private readonly statusMap = new Map<string, number>([
    [NotFoundException.name, HttpStatus.NOT_FOUND],
    [ConflictException.name, HttpStatus.CONFLICT],
    [ValidationException.name, HttpStatus.BAD_REQUEST],
    [UnauthorizedException.name, HttpStatus.UNAUTHORIZED],
    [ExternalServiceException.name, HttpStatus.SERVICE_UNAVAILABLE],
  ]);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.statusMap.get(exception.constructor.name) ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.warn(`${exception.constructor.name}: ${exception.message}`);

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        code: exception.constructor.name,
        message: exception.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
