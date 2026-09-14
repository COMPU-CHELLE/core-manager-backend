import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpExceptionResponseBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Error interno del servidor';
    let errorName = 'InternalServerError';

    if (isHttpException) {
      const exceptionResponse = exception.getResponse();

      errorName = exception.name;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (this.isHttpExceptionResponse(exceptionResponse)) {
        const msg = exceptionResponse.message;

        if (Array.isArray(msg)) {
          message = msg.join(', ');
        } else if (typeof msg === 'string') {
          message = msg;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error: errorName,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  /**
   * 🔒 Type guard seguro
   */
  private isHttpExceptionResponse(
    value: unknown,
  ): value is HttpExceptionResponseBody {
    return typeof value === 'object' && value !== null && 'message' in value;
  }
}
