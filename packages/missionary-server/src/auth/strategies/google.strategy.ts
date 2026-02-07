import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

const PLACEHOLDER_CLIENT_ID = 'not-configured';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');

    super({
      clientID: clientID || PLACEHOLDER_CLIENT_ID,
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') ||
        PLACEHOLDER_CLIENT_ID,
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3100/auth/google/callback',
      scope: ['email', 'profile'],
    });

    if (!clientID) {
      this.logger.warn(
        'GOOGLE_CLIENT_ID가 설정되지 않았습니다. Google OAuth 로그인이 비활성화됩니다.',
      );
    }
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { id: string; emails?: { value: string }[]; displayName?: string },
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(
        new Error('Google 계정에서 이메일을 가져올 수 없습니다'),
        false,
      );
    }

    const user = await this.authService.validateOAuthUser(
      'GOOGLE',
      profile.id,
      email,
      profile.displayName,
    );

    done(null, user);
  }
}
