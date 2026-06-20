import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response, Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logRequest(method, originalUrl, response.statusCode, duration);
        },
        error: (err: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode =
            err instanceof HttpException
              ? err.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
          this.logRequest(method, originalUrl, statusCode, duration);
        },
      }),
    );
  }

  private logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ): void {
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      this.logger.error(message);
    } else if (statusCode >= 400) {
      this.logger.warn(message);
    } else {
      this.logger.log(message);
    }
  }
}
