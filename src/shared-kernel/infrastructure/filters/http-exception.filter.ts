import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else {
      const raw = (exceptionResponse as Record<string, unknown>).message;
      message = Array.isArray(raw)
        ? raw.join(', ')
        : (raw as string) || exception.message;
    }

    this.logger.warn(`${exception.constructor.name}: ${message}`);

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        code: exception.constructor.name,
        message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
