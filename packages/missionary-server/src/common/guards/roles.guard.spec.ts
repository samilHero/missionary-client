import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockExecutionContext = (
    user: any,
    requiredRoles?: UserRole[],
  ): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as any;
  };

  describe('canActivate', () => {
    it('should allow access if no roles are required', () => {
      const context = createMockExecutionContext({ role: UserRole.USER });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access if user has required role', () => {
      const context = createMockExecutionContext({ role: UserRole.ADMIN });
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access if user does not have required role', () => {
      const context = createMockExecutionContext({ role: UserRole.USER });
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should allow access if user has one of multiple required roles', () => {
      const context = createMockExecutionContext({ role: UserRole.STAFF });
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN, UserRole.STAFF]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access if user has no role', () => {
      const context = createMockExecutionContext({});
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should deny access if user is not authenticated', () => {
      const context = createMockExecutionContext(null);
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should use correct metadata key', () => {
      const context = createMockExecutionContext({ role: UserRole.ADMIN });
      const spy = jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      guard.canActivate(context);

      expect(spy).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});
