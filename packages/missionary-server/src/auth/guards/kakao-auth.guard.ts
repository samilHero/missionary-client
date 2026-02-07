import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const clientId = this.configService.get<string>('KAKAO_CLIENT_ID');

    if (!clientId) {
      throw new UnauthorizedException(
        'Kakao OAuth가 설정되지 않았습니다. KAKAO_CLIENT_ID를 확인해주세요.',
      );
    }

    return super.canActivate(context);
  }
}
