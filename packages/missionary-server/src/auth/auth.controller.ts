import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthExceptionFilter } from './filters/oauth-exception.filter';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private get cookieOptions() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
    const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', tokens.accessToken, {
      ...this.cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      ...this.cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'ID/PW 로그인' })
  login(
    @Body() _loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    const tokens = this.authService.generateTokens(user);

    this.setTokenCookies(res, tokens);

    return { message: '로그인 성공' };
  }

  @Post('admin/login')
  @ApiOperation({ summary: '관리자 로그인 (loginId/password)' })
  async adminLogin(
    @Body() adminLoginDto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.loginAdmin(adminLoginDto);

    this.setTokenCookies(res, tokens);

    return { message: '관리자 로그인 성공' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Google OAuth 로그인 시작' })
  googleLogin() {
    // GoogleAuthGuard가 리다이렉트 처리
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Google OAuth 콜백' })
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    const tokens = this.authService.generateTokens(user);

    this.setTokenCookies(res, tokens);

    const clientUrl = this.configService.get<string>(
      'ADMIN_CLIENT_URL',
      'http://localhost:3001',
    );
    res.redirect(clientUrl);
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Kakao OAuth 로그인 시작' })
  kakaoLogin() {
    // KakaoAuthGuard가 리다이렉트 처리
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @ApiOperation({ summary: 'Kakao OAuth 콜백' })
  kakaoCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    const tokens = this.authService.generateTokens(user);

    this.setTokenCookies(res, tokens);

    const clientUrl = this.configService.get<string>(
      'ADMIN_CLIENT_URL',
      'http://localhost:3001',
    );
    res.redirect(clientUrl);
  }

  @Post('refresh')
  @ApiOperation({ summary: '액세스 토큰 갱신' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ message: '리프레시 토큰이 없습니다' });
      return;
    }

    const tokens = await this.authService.refreshAccessToken(refreshToken);

    this.setTokenCookies(res, tokens);

    return { message: '토큰 갱신 성공' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '현재 로그인 사용자 정보 조회' })
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);

    return { message: '로그아웃 성공' };
  }
}
