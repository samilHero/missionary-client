import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '이메일 주소' })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare name?: string;

  @ApiProperty({
    example: '010-1234-5678',
    description: '전화번호',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare phoneNumber?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: '생년월일',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  declare birthDate?: string;

  @ApiProperty({
    example: 'M',
    description: '성별',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare gender?: string;

  @ApiProperty({
    example: true,
    description: '세례 여부',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  declare isBaptized?: boolean;

  @ApiProperty({
    example: '2020-01-01',
    description: '세례 일시',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  declare baptizedAt?: string;

  @ApiProperty({
    example: '900101-1234567',
    description: '주민등록번호 (암호화됨)',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare identityNumber?: string;

  @ApiProperty({
    example: 'admin123',
    description: '로그인 ID (관리자용)',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare loginId?: string;
}
