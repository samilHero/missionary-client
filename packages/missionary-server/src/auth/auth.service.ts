import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '@/user/user.service';

import type { AdminLoginDto } from './dto/admin-login.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type { AuthProvider } from '../../prisma/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다',
      );
    }

    return user;
  }

  async validateOAuthUser(
    provider: AuthProvider,
    providerId: string,
    email: string,
    name?: string,
  ) {
    const existingByProvider = await this.userService.findByProvider(
      provider,
      providerId,
    );

    if (existingByProvider) {
      return existingByProvider;
    }

    const existingByEmail = await this.userService.findByEmail(email);

    if (existingByEmail) {
      return existingByEmail;
    }

    return this.userService.createOAuthUser({
      email,
      name,
      provider,
      providerId,
    });
  }

  generateTokens(user: {
    id: string;
    email: string | null;
    role: string;
    provider: string | null;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    const ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60;
    const REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60;

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_TOKEN_EXPIRY_SECONDS,
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findOne(payload.sub);

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('리프레시 토큰이 유효하지 않습니다');
    }
  }

  async loginAdmin(adminLoginDto: AdminLoginDto) {
    const user = await this.userService.findByLoginIdAndRole(
      adminLoginDto.loginId,
      'ADMIN' as const,
    );

    if (!user || !user.password) {
      throw new UnauthorizedException('관리자 인증에 실패했습니다');
    }

    const isPasswordValid = await bcrypt.compare(
      adminLoginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('관리자 인증에 실패했습니다');
    }

    return this.generateTokens(user);
  }
}
