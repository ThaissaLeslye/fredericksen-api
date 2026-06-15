import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';
import { ActiveUser } from '../../modules/auth/auth.interfaces';

describe('CurrentUser Decorator', () => {
  it('deve extrair o objeto do usuário ativo contido na requisição com sucesso', () => {
    const factory = getParamDecoratorFactory(CurrentUser);

    const mockUser: ActiveUser = {
      id: 'user-uuid-123',
      name: 'Thaissa Leslye',
      email: 'thaissa@example.com',
      photoUrl: null,
    };

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = factory(undefined, mockExecutionContext) as ActiveUser;

    expect(result).toEqual(mockUser);
    expect(result.id).toBe('user-uuid-123');
  });

  it('deve cobrir branches remanescentes quando dados adicionais fictícios são passados ao decorator', () => {
    const factory = getParamDecoratorFactory(CurrentUser);

    const mockUser: ActiveUser = {
      id: 'user-uuid-123',
      name: 'Thaissa Leslye',
      email: 'thaissa@example.com',
      photoUrl: null,
    };

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;

    const result = factory('any_property', mockExecutionContext) as ActiveUser;

    expect(result).toBeDefined();
  });
});

function getParamDecoratorFactory(decorator: Function) {
  class TestController {
    test(@decorator() _value: unknown) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestController, 'test');
  return args[Object.keys(args)[0]].factory;
}
