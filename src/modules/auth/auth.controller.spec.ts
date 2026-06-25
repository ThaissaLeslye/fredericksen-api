/**
 * @file auth.controller.spec.ts
 * @description Unit tests for the AuthController.
 * @responsibility Orchestrates the Google OAuth2 callback flow and cookie management.
 * @strategy Mocks AuthService and Express Response objects to validate redirects and security headers.
 * @assertion Ensures that access tokens are securely stored in httpOnly cookies and users are redirected to the frontend.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { Response } from 'express';
import { RequestWithUser } from './auth.interfaces';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let configService: ConfigService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'thaissa@example.com',
    name: 'Thaissa Leslye',
  } as User;

  const mockRequest = {
    user: {
      googleId: 'google-123',
      email: 'thaissa@example.com',
      firstName: 'Thaissa',
      lastName: 'Leslye',
      picture: 'https://photo.url',
      accessToken: 'google-token',
    },
  } as RequestWithUser;

  const mockResponse = {
    cookie: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateGoogleUser: jest.fn().mockResolvedValue(mockUser),
            generateJwt: jest
              .fn()
              .mockResolvedValue({ access_token: 'fake-jwt' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('production'),
            getOrThrow: jest.fn((key: string) => {
              const mockConfig: Record<string, string | number> = {
                FREDERICKSEN_WEB_URL: 'https://rick.tllo.app/',
                JWT_EXPIRES_IN: 7200,
              };
              return mockConfig[key];
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should validate user, set security cookie and redirect to home', async () => {
      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(authService.validateGoogleUser).toHaveBeenCalledWith(
        mockRequest.user,
      );

      expect(authService.generateJwt).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'fake-jwt',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 7200000,
        }),
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'https://rick.tllo.app/',
      );
    });
  });
  describe('googleLogout', () => {
    it('should clear the access token cookie with proper security attributes', () => {
      const mockResponseLogout = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      controller.googleLogout(mockResponseLogout);

      expect(mockResponseLogout.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        }),
      );
    });
  });
});
