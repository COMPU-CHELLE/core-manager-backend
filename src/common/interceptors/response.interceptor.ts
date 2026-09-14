import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
import { ApiSuccessResponse, RawResponse } from './api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    // 🔥 no envolver login
    if (request.url.includes('/auth/login')) {
      return next.handle() as unknown as Observable<ApiSuccessResponse<T>>;
    }

    return next.handle().pipe(
      map((data: T | RawResponse<T>): ApiSuccessResponse<T> => {
        if (this.isRawResponse(data)) {
          return data.payload;
        }

        return {
          success: true,
          message: null,
          type: 'success',
          data,
        };
      }),
    );
  }

  private isRawResponse<T>(value: T | RawResponse<T>): value is RawResponse<T> {
    return typeof value === 'object' && value !== null && '__raw' in value;
  }
}
