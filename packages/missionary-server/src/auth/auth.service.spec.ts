import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { UserService } from '@/user/user.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockAdminUser = {
    id: 'admin-uuid-1',
    email: 'admin@example.com',
    role: 'ADMIN' as const,
    password: '$2b$10$X8Z4Y5W6...',
    loginId: 'admin',
    provider: 'LOCAL' as const,
    providerId: null,
    name: 'Admin User',
    phoneNumber: null,
    birthDate: null,
    gender: null,
    isBaptized: false,
    baptizedAt: null,
    identityNumber: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    createdBy: 'system',
    updatedBy: 'system',
    version: 1,
  };

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      findByProvider: jest.fn(),
      createOAuthUser: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByLoginIdAndRole: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService) as jest.Mocked<UserService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should include role in JWT payload', () => {
      const user = {
        id: 'user-uuid-1',
        email: 'admin@example.com',
        role: 'ADMIN',
        provider: 'LOCAL',
      };

      jwtService.sign.mockReturnValueOnce('mock-access-token');
      jwtService.sign.mockReturnValueOnce('mock-refresh-token');

      const tokens = service.generateTokens(user);

      expect(tokens).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: user.id,
          email: user.email,
          role: user.role,
          provider: user.provider,
        }),
        expect.any(Object),
      );
    });

    it('should generate access token with correct expiration', () => {
      const user = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        role: 'USER',
        provider: 'GOOGLE',
      };

      jwtService.sign.mockReturnValue('mock-token');

      service.generateTokens(user);

      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        expect.any(Object),
        expect.objectContaining({
          secret: 'test-secret',
          expiresIn: 15 * 60,
        }),
      );
    });

    it('should generate refresh token with correct expiration', () => {
      const user = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        role: 'USER',
        provider: 'KAKAO',
      };

      jwtService.sign.mockReturnValue('mock-token');

      service.generateTokens(user);

      expect(jwtService.sign).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        expect.objectContaining({
          secret: 'test-refresh-secret',
          expiresIn: 7 * 24 * 60 * 60,
        }),
      );
    });
  });

  describe('loginAdmin', () => {
    const adminLoginDto = {
      loginId: 'admin',
      password: 'password123',
    };

    beforeEach(() => {
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
    });

    it('should successfully login admin with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const adminUser = {
        ...mockAdminUser,
        password: hashedPassword,
      };

      userService.findByLoginIdAndRole.mockResolvedValueOnce(adminUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(true);
      jwtService.sign.mockReturnValueOnce('mock-access-token');
      jwtService.sign.mockReturnValueOnce('mock-refresh-token');

      const result = await service.loginAdmin(adminLoginDto);

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      expect(userService.findByLoginIdAndRole).toHaveBeenCalledWith(
        'admin',
        'ADMIN',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        hashedPassword,
      );
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      const adminUser = {
        ...mockAdminUser,
        password: hashedPassword,
      };

      userService.findByLoginIdAndRole.mockResolvedValueOnce(adminUser);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        '관리자 인증에 실패했습니다',
      );
    });

    it('should throw UnauthorizedException with non-existent loginId', async () => {
      userService.findByLoginIdAndRole.mockResolvedValueOnce(null);

      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        '관리자 인증에 실패했습니다',
      );
    });

    it('should throw UnauthorizedException when user has no password', async () => {
      const adminUserNoPassword = {
        ...mockAdminUser,
        password: null,
      };

      userService.findByLoginIdAndRole.mockResolvedValueOnce(
        adminUserNoPassword,
      );

      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow(
        '관리자 인증에 실패했습니다',
      );
    });

    it('should only query users with ADMIN role', async () => {
      userService.findByLoginIdAndRole.mockResolvedValueOnce(null);

      await expect(service.loginAdmin(adminLoginDto)).rejects.toThrow();

      expect(userService.findByLoginIdAndRole).toHaveBeenCalledWith(
        'admin',
        'ADMIN',
      );
    });
  });

  describe('validateLocalUser', () => {
    it('should validate user with correct email and password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = { ...mockAdminUser, password: hashedPassword };

      userService.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateLocalUser(
        'admin@example.com',
        'password123',
      );

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      const user = { ...mockAdminUser, password: hashedPassword };

      userService.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as unknown as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        service.validateLocalUser('admin@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with non-existent email', async () => {
      userService.findByEmail.mockResolvedValueOnce(null);

      await expect(
        service.validateLocalUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate new tokens with valid refresh token', async () => {
      const payload = {
        sub: 'user-uuid-1',
        email: 'test@example.com',
        role: 'USER' as const,
        provider: 'LOCAL' as const,
      };

      jwtService.verify.mockReturnValueOnce(payload);
      userService.findOne.mockResolvedValueOnce(mockAdminUser);
      jwtService.sign.mockReturnValueOnce('new-access-token');
      jwtService.sign.mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshAccessToken('valid-refresh-token');

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      expect(jwtService.verify).toHaveBeenCalledWith('valid-refresh-token', {
        secret: 'test-refresh-secret',
      });
    });

    it('should throw UnauthorizedException with invalid refresh token', async () => {
      jwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshAccessToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
