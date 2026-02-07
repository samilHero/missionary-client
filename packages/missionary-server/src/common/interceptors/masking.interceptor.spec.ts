import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

import { MaskingInterceptor } from './masking.interceptor';

describe('MaskingInterceptor', () => {
  let interceptor: MaskingInterceptor;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new MaskingInterceptor();
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  const createMockContext = (): ExecutionContext => {
    return {} as ExecutionContext;
  };

  describe('intercept', () => {
    it('should mask phoneNumber field (last 6 chars)', (done) => {
      const responseData = {
        phoneNumber: '010-1234-5678',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.phoneNumber).toBe('010-123******');
          done();
        },
      });
    });

    it('should mask identityNumber field (last 6 chars)', (done) => {
      const responseData = {
        identityNumber: '123456-1234567',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.identityNumber).toBe('123456-1******');
          done();
        },
      });
    });

    it('should mask bankAccount field (last 6 chars)', (done) => {
      const responseData = {
        bankAccount: '123-456-789012',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.bankAccount).toBe('123-456-******');
          done();
        },
      });
    });

    it('should mask multiple PII fields in same object', (done) => {
      const responseData = {
        name: 'John Doe',
        phoneNumber: '010-1234-5678',
        identityNumber: '123456-1234567',
        bankAccount: '123-456-789012',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.name).toBe('John Doe');
          expect(data.phoneNumber).toBe('010-123******');
          expect(data.identityNumber).toBe('123456-1******');
          expect(data.bankAccount).toBe('123-456-******');
          done();
        },
      });
    });

    it('should mask PII fields in nested objects', (done) => {
      const responseData = {
        user: {
          phoneNumber: '010-9876-5432',
        },
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.user.phoneNumber).toBe('010-987******');
          done();
        },
      });
    });

    it('should mask PII fields in arrays', (done) => {
      const responseData = [
        { phoneNumber: '010-1111-2222' },
        { phoneNumber: '010-3333-4444' },
      ];

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data[0].phoneNumber).toBe('010-111******');
          expect(data[1].phoneNumber).toBe('010-333******');
          done();
        },
      });
    });

    it('should handle short strings (6 chars or less) by masking entire value', (done) => {
      const responseData = {
        phoneNumber: '123456',
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.phoneNumber).toBe('******');
          done();
        },
      });
    });

    it('should handle null values', (done) => {
      const responseData = {
        phoneNumber: null,
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.phoneNumber).toBe('******');
          done();
        },
      });
    });

    it('should handle undefined values', (done) => {
      const responseData = {
        phoneNumber: undefined,
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data.phoneNumber).toBe('******');
          done();
        },
      });
    });

    it('should not modify non-PII fields', (done) => {
      const responseData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data).toEqual(responseData);
          done();
        },
      });
    });

    it('should handle empty response', (done) => {
      const responseData = {};

      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data).toEqual({});
          done();
        },
      });
    });

    it('should handle null response', (done) => {
      mockCallHandler.handle = jest.fn().mockReturnValue(of(null));

      interceptor.intercept(createMockContext(), mockCallHandler).subscribe({
        next: (data) => {
          expect(data).toBeNull();
          done();
        },
      });
    });
  });

  describe('maskLast6Chars', () => {
    it('should mask last 6 characters', () => {
      const masked = (interceptor as any).maskLast6Chars('010-1234-5678');
      expect(masked).toBe('010-123******');
    });

    it('should handle short strings', () => {
      const masked = (interceptor as any).maskLast6Chars('123');
      expect(masked).toBe('******');
    });

    it('should handle null', () => {
      const masked = (interceptor as any).maskLast6Chars(null);
      expect(masked).toBe('******');
    });

    it('should handle undefined', () => {
      const masked = (interceptor as any).maskLast6Chars(undefined);
      expect(masked).toBe('******');
    });

    it('should handle exact 6 characters', () => {
      const masked = (interceptor as any).maskLast6Chars('123456');
      expect(masked).toBe('******');
    });

    it('should handle 7 characters', () => {
      const masked = (interceptor as any).maskLast6Chars('1234567');
      expect(masked).toBe('1******');
    });
  });
});
