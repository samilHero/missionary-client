import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MaskingInterceptor implements NestInterceptor {
  private readonly PII_FIELDS = [
    'phoneNumber',
    'identityNumber',
    'bankAccount',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.maskData(data)));
  }

  private maskData(data: any): any {
    if (!data) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.maskData(item));
    }

    if (typeof data === 'object') {
      const masked = { ...data };

      for (const key in masked) {
        if (this.PII_FIELDS.includes(key)) {
          masked[key] = this.maskLast6Chars(masked[key]);
        } else if (typeof masked[key] === 'object') {
          masked[key] = this.maskData(masked[key]);
        }
      }

      return masked;
    }

    return data;
  }

  private maskLast6Chars(value: any): string {
    if (!value || value.length <= 6) {
      return '******';
    }

    return value.slice(0, -6) + '******';
  }
}
