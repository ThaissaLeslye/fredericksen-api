import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './google-auth.guard';

describe('GoogleAuthGuard', () => {
  let guard: GoogleAuthGuard;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn((key: string) => {
        const mockConfig: Record<string, string> = {
          FREDERICKSEN_WEB_URL: 'https://rick.tllo.app/',
        };
        return mockConfig[key];
      }),
    } as unknown as ConfigService;

    guard = new GoogleAuthGuard(configService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return a cancel redirect query parameter when hit by an access_denied error context', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        query: { error: 'access_denied' },
      }),
    } as unknown as ExecutionContext;

    const options = guard.getAuthenticateOptions(mockExecutionContext);

    expect(options).toEqual({
      failureRedirect: 'https://rick.tllo.app/login?error=cancel',
    });
  });

  it('should default to an unauthorized redirect query parameter when an unmapped error code strikes', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        query: { error: 'internal_server_misconfiguration' },
      }),
    } as unknown as ExecutionContext;

    const options = guard.getAuthenticateOptions(mockExecutionContext);

    expect(options).toEqual({
      failureRedirect: 'https://rick.tllo.app/login?error=unauthorized',
    });
  });

  it('should handle trailing slash anomalies gracefully during redirect construction', () => {
    jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(
      'https://rick.tllo.app',
    );

    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        query: { error: 'access_denied' },
      }),
    } as unknown as ExecutionContext;

    const options = guard.getAuthenticateOptions(mockExecutionContext);

    expect(options.failureRedirect).toBe(
      'https://rick.tllo.app/login?error=cancel',
    );
  });
});
