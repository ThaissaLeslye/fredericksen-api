import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { Profile } from 'passport-google-oauth20';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              const mockConfig: Record<string, string> = {
                GOOGLE_CLIENT_ID: 'mock-client-id',
                GOOGLE_CLIENT_SECRET: 'mock-client-secret',
                GOOGLE_CALLBACK_URL: 'http://localhost:3000/callback',
              };
              return mockConfig[key];
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('deve estar definido', () => {
    expect(strategy).toBeDefined();
  });

  it('deve validar e retornar o payload mapeado do usuário se o perfil do Google for íntegro', async () => {
    // NOVO: Mock estrutural de um perfil retornado com sucesso pelo provedor OAuth2 — garante execução do caminho feliz
    const mockProfile: unknown = {
      id: 'google-uid-12345',
      name: {
        givenName: 'Thaissa',
        familyName: 'Leslye',
      },
      emails: [{ value: 'thaissa@example.com', verified: true }],
      photos: [{ value: 'https://avatar.url/image.png' }],
    };

    const result = await strategy.validate(
      'mock-access-token',
      'mock-refresh-token',
      mockProfile as Profile,
    );

    expect(result).toEqual({
      googleId: 'google-uid-12345',
      email: 'thaissa@example.com',
      firstName: 'Thaissa',
      lastName: 'Leslye',
      picture: 'https://avatar.url/image.png',
      accessToken: 'mock-access-token',
    });
  });

  it('deve retornar uma string vazia para a propriedade picture caso a estrutura de fotos venha ausente', async () => {
    const mockProfile: unknown = {
      id: 'google-uid-12345',
      name: { givenName: 'Thaissa', familyName: 'Leslye' },
      emails: [{ value: 'thaissa@example.com', verified: true }],
    };

    const result = await strategy.validate(
      'mock-access-token',
      'mock-refresh-token',
      mockProfile as Profile,
    );
    expect(result.picture).toBe('');
  });

  it('deve lançar uma exceção se a lista de e-mails estiver vazia ou indefinida', () => {
    const mockProfile: unknown = {
      id: 'google-uid-12345',
      name: { givenName: 'Thaissa', familyName: 'Leslye' },
    };

    expect(() =>
      strategy.validate(
        'mock-access-token',
        'mock-refresh-token',
        mockProfile as Profile,
      ),
    ).toThrow('No email found in Google profile');
  });

  it('deve lançar uma exceção se o objeto name não for fornecido pelo provedor externo', () => {
    const mockProfile: unknown = {
      id: 'google-uid-12345',
      emails: [{ value: 'thaissa@example.com', verified: true }],
    };

    expect(() =>
      strategy.validate(
        'mock-access-token',
        'mock-refresh-token',
        mockProfile as Profile,
      ),
    ).toThrow('No name found in Google profile');
  });
});
