import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('UnhandledException');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    this.logger.error(
      message,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'InternalServerError',
        message: 'Internal server error',
      },
      timestamp: new Date().toISOString(),
    });
  }
}
