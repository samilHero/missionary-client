import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMissionaryDto {
  @ApiProperty({ example: '2024 제주선교', description: '선교 이름' })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({ example: '2024-07-01', description: '시작일' })
  @IsDateString()
  declare startDate: string;

  @ApiProperty({ example: '2024-07-07', description: '종료일' })
  @IsDateString()
  declare endDate: string;

  @ApiProperty({
    example: '김목사',
    description: '담당 교역자 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare pastorName?: string;

  @ApiProperty({
    example: '010-1234-5678',
    description: '담당 교역자 전화번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare pastorPhone?: string;

  @ApiProperty({
    example: '2024-06-01',
    description: '참가 신청 시작일',
  })
  @IsDateString()
  declare participationStartDate: string;

  @ApiProperty({
    example: '2024-06-25',
    description: '참가 신청 종료일',
  })
  @IsDateString()
  declare participationEndDate: string;

  @ApiProperty({
    example: 500000,
    description: '참가 비용 (원)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  declare price?: number;

  @ApiProperty({
    example: '제주도 지역 복음 전파 및 지역 교회 섬김 활동',
    description: '선교 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare description?: string;

  @ApiProperty({
    example: 50,
    description: '최대 참가 인원',
    required: false,
  })
  @IsOptional()
  @IsInt()
  declare maximumParticipantCount?: number;

  @ApiProperty({
    example: '국민은행',
    description: '은행명',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare bankName?: string;

  @ApiProperty({
    example: '새일교회',
    description: '예금주',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare bankAccountHolder?: string;

  @ApiProperty({
    example: '123-456-789012',
    description: '계좌번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare bankAccountNumber?: string;

  @ApiProperty({
    example: 'uuid-string',
    description: '선교 지역 ID',
  })
  @IsUUID()
  declare regionId: string;

  @ApiProperty({
    enum: ['RECRUITING', 'IN_PROGRESS', 'COMPLETED'],
    description: '선교 상태',
    required: false,
    default: 'RECRUITING',
  })
  @IsOptional()
  @IsEnum(['RECRUITING', 'IN_PROGRESS', 'COMPLETED'])
  declare status?: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
}
