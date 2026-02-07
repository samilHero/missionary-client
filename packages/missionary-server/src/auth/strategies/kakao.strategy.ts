import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

import { AuthService } from '../auth.service';

const PLACEHOLDER_CLIENT_ID = 'not-configured';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  private readonly logger = new Logger(KakaoStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('KAKAO_CLIENT_ID');

    super({
      clientID: clientID || PLACEHOLDER_CLIENT_ID,
      clientSecret:
        configService.get<string>('KAKAO_CLIENT_SECRET') ||
        PLACEHOLDER_CLIENT_ID,
      callbackURL:
        configService.get<string>('KAKAO_CALLBACK_URL') ||
        'http://localhost:3100/auth/kakao/callback',
    });

    if (!clientID) {
      this.logger.warn(
        'KAKAO_CLIENT_ID가 설정되지 않았습니다. Kakao OAuth 로그인이 비활성화됩니다.',
      );
    }
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      _json?: { kakao_account?: { email?: string } };
      displayName?: string;
    },
    done: (error: Error | null, user?: object | false) => void,
  ) {
    const email = profile._json?.kakao_account?.email;

    if (!email) {
      return done(
        new Error('Kakao 계정에서 이메일을 가져올 수 없습니다'),
        false,
      );
    }

    const user = await this.authService.validateOAuthUser(
      'KAKAO',
      profile.id,
      email,
      profile.displayName,
    );

    done(null, user);
  }
}
