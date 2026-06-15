import { HttpException, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      method: 'GET',
      url: '/test-route',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse as Response,
        getRequest: () => mockRequest as Request,
      }),
    };
  });

  it('deve formatar uma exceção 400 (HttpException) corretamente e gerar logs de aviso', () => {
    const exception = new HttpException({ message: 'Bad Request Error' }, 400);

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/test-route',
        message: 'Bad Request Error',
      }),
    );
  });

  it('deve formatar uma exceção 500 corretamente e acionar o log de erro crítico', () => {
    // NOVO: Emulação de falha interna grave para forçar a execução da branch de logging de erro do filtro
    const exception = new HttpException('Internal Server Error', 500);

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        path: '/test-route',
        message: 'Internal Server Error',
      }),
    );
  });

  it('deve usar mensagem genérica padrão se o objeto de resposta da exceção não contiver a propriedade message', () => {
    const exception = new HttpException({}, 400);

    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Erro interno do servidor',
      }),
    );
  });
});
