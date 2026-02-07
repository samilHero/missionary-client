import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateAgreementDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  declare userId: string;

  @ApiProperty({
    description: '동의 여부',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  declare isAgreed?: boolean;
}
