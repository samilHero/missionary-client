import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMissionaryChurchDto {
  @ApiProperty({ example: '새일교회 제주지교회', description: '교회 이름' })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({
    example: '복음 전파',
    description: '방문 목적',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare visitPurpose?: string;

  @ApiProperty({
    example: '김목사',
    description: '담임 목사 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare pastorName?: string;

  @ApiProperty({
    example: '010-1234-5678',
    description: '담임 목사 전화번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare pastorPhone?: string;

  @ApiProperty({
    example: '제주특별자치도 제주시 중앙로 123',
    description: '기본 주소',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare addressBasic?: string;

  @ApiProperty({
    example: '101호',
    description: '상세 주소',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare addressDetail?: string;
}
