import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
@Catch()
export class OAuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(OAuthExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'OAuth 인증 중 알 수 없는 오류가 발생했습니다';

    this.logger.error(
      `OAuth 인증 실패: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    const clientUrl = this.configService.get<string>(
      'ADMIN_CLIENT_URL',
      'http://localhost:3001',
    );

    const errorParam = encodeURIComponent(message);
    res.redirect(`${clientUrl}/login?error=${errorParam}`);
  }
}
