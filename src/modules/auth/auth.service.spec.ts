/**
 * @file auth.service.spec.ts
 * @description Unit tests for the AuthService.
 * @responsibility Handles user authentication logic, Google profile validation, and JWT generation.
 * @strategy Mocks PrismaService to isolate database upsert logic and JwtService to simulate token signing.
 * @logic Ensures RFE01 (Google Login) correctly creates/updates users and RNF01 (Security) issues valid tokens.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { GoogleUser } from './auth.interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockDate = new Date();
  const mockUser: User = {
    id: 'user-uuid-123',
    email: 'fulana@example.com',
    name: 'Fulana de Tal',
    googleId: 'google-id-999',
    photoUrl: 'https://photo.url',
    lastLogin: mockDate,
    createdAt: mockDate,
  };

  const mockGoogleUser: GoogleUser = {
    googleId: 'google-id-999',
    email: 'fulana@example.com',
    firstName: 'Fulana',
    lastName: 'de Tal',
    accessToken: 'mock-google-token',
    picture: 'https://photo.url',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              upsert: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateGoogleUser', () => {
    it('should call prisma.user.upsert with correct mapping', async () => {
      const upsertSpy = jest.spyOn(prisma.user, 'upsert');

      await service.validateGoogleUser(mockGoogleUser);

      const callArgs = upsertSpy.mock.calls[0][0];

      expect(callArgs.where).toEqual({ googleId: mockGoogleUser.googleId });
      expect(callArgs.include).toEqual({ profile: true });

      expect(callArgs.update).toMatchObject({
        name: 'Fulana de Tal',
        photoUrl: mockGoogleUser.picture,
      });

      expect(callArgs.create).toMatchObject({
        email: mockGoogleUser.email,
        profile: { create: {} },
      });
    });
  });

  describe('generateJwt', () => {
    it('should generate a token with sub and email in the payload', async () => {
      const result = await service.generateJwt(mockUser);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });
  });
});
