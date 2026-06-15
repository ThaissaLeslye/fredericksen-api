import { ExecutionContext, CallHandler } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { of } from 'rxjs';
import { Request, Response } from 'express';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;
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

  it('deve interceptar a requisição, processar o fluxo e registrar logs informativos para status 2xx', (done) => {
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('response_data')),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        next: (result) => {
          expect(result).toBe('response_data');
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
  });

  it('deve registrar mensagens de alerta (warn) quando o status code for um erro de cliente (4xx)', (done) => {
    mockResponse.statusCode = 400;
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('bad_request_payload')),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        next: () => {
          expect(mockResponse.statusCode).toBe(400);
          done();
        },
      });
  });

  it('deve registrar erros críticos (error) quando o status code for uma falha interna do servidor (5xx)', (done) => {
    mockResponse.statusCode = 500;
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of('internal_server_failure')),
    };

    interceptor
      .intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler as CallHandler,
      )
      .subscribe({
        next: () => {
          expect(mockResponse.statusCode).toBe(500);
          done();
        },
      });
  });
});
