import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('deve inicializar as propriedades corretamente através do construtor utilizando Object.assign', () => {
    const mockDate = new Date();
    const partialData: Partial<UserEntity> = {
      id: 'uuid-teste-123',
      name: 'Thaissa Leslye',
      email: 'thaissa@example.com',
      createdAt: mockDate,
    };

    const entity = new UserEntity(partialData);

    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.id).toBe('uuid-teste-123');
    expect(entity.name).toBe('Thaissa Leslye');
    expect(entity.email).toBe('thaissa@example.com');
    expect(entity.createdAt).toBe(mockDate);
  });

  it('deve lidar corretamente com a inicialização quando um objeto vazio é fornecido', () => {
    const entity = new UserEntity({});
    expect(entity).toBeInstanceOf(UserEntity);
    expect(entity.id).toBeUndefined();
  });
});
