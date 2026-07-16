import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserOwnershipGuard } from './user-ownership.guard';

describe('UserOwnershipGuard', () => {
  let guard: UserOwnershipGuard;

  beforeEach(() => {
    guard = new UserOwnershipGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow activation when userId matches paramId', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: 'user-123' },
          user: { id: 'user-123' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should throw ForbiddenException when userId does not match paramId', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: 'user-456' },
          user: { id: 'user-123' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should return false when user is not present on request', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: 'user-123' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('should allow activation when no paramId is present', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: {},
          user: { id: 'user-123' },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });
});
