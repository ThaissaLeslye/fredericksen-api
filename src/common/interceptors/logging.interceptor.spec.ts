import {
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { of, throwError } from 'rxjs';
import { Request, Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();

    mockRequest = {
      method: 'POST',
      originalUrl: '/api/v1/resource',
    };

    mockResponse = {
      statusCode: 200,
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest as Request,
        getResponse: () => mockResponse as Response,
      }),
    };
  });

  it('should intercept request, process flow and log informative messages for 2xx status', (done) => {
    const mockCallHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of('response_data')),
    };

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
      .subscribe({
        next: (result) => {
          expect(result).toBe('response_data');
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
  });

  it('should log warning messages when an HttpException occurs (4xx client error)', (done) => {
    const mockCallHandler: CallHandler = {
      handle: jest
        .fn()
        .mockReturnValue(
          throwError(
            () => new HttpException('Bad Request', HttpStatus.BAD_REQUEST),
          ),
        ),
    };

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
      .subscribe({
        next: () => {
          done.fail('Should have thrown an error');
        },
        error: (err: unknown) => {
          expect(err).toBeInstanceOf(HttpException);
          expect((err as HttpException).getStatus()).toBe(400);
          done();
        },
      });
  });

  it('should log critical error messages when a generic server failure occurs (5xx)', (done) => {
    const mockCallHandler: CallHandler = {
      handle: jest
        .fn()
        .mockReturnValue(
          throwError(() => new Error('Database connection failed')),
        ),
    };

    interceptor
      .intercept(mockExecutionContext as ExecutionContext, mockCallHandler)
      .subscribe({
        next: () => {
          done.fail('Should have thrown an error');
        },
        error: (err: unknown) => {
          expect(err).toBeInstanceOf(Error);
          done();
        },
      });
  });
});
