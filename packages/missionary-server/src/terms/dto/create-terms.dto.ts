import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

import { TermsType } from '@/common/enums/terms-type.enum';

export class CreateTermsDto {
  @ApiProperty({
    enum: TermsType,
    description: '약관 타입',
    example: TermsType.USING_OF_SERVICE,
  })
  @IsEnum(TermsType)
  declare termsType: TermsType;

  @ApiProperty({
    description: '약관 URL',
    example: 'https://example.com/terms',
  })
  @IsString()
  declare termsUrl: string;

  @ApiProperty({
    description: '사용 여부',
    example: true,
  })
  @IsBoolean()
  declare isUsed: boolean;

  @ApiProperty({
    description: '약관 제목',
    example: '서비스 이용약관',
  })
  @IsString()
  declare termsTitle: string;

  @ApiProperty({
    description: '정렬 순서',
    example: 1,
  })
  @IsInt()
  declare seq: number;

  @ApiProperty({
    description: '필수 약관 여부',
    example: true,
  })
  @IsBoolean()
  declare isEssential: boolean;

  @ApiProperty({
    description: '약관 설명',
    example: '서비스 이용을 위한 필수 약관입니다',
    required: false,
  })
  @IsString()
  @IsOptional()
  declare termsDescription?: string;
}
