import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: PrismaService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'super-secret-test-key';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('super-secret-test-key'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve retornar o usuário se o payload for válido e o usuário existir', async () => {
    const mockUser = { id: 'uuid-123', email: 'test@test.com', name: 'Fulana' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await strategy.validate({
      sub: 'uuid-123',
      email: 'test@test.com',
    });

    expect(result).toEqual(mockUser);

    /* The 'prisma.user.findUnique' is a Jest mock (jest.fn()). 
      In this test context, the 'this' scope is managed by the test engine, 
      making this assertion safe from unintentional scoping side effects 
      and preventing false positives.
    */

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'uuid-123' },
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
          profile: true,
        },
      }),
    );
  });

  it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      strategy.validate({ sub: 'invalid-id', email: '' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
