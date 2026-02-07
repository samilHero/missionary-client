import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMissionaryPosterDto {
  @ApiProperty({ example: '선교 포스터 1', description: '포스터 이름' })
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @ApiProperty({
    example: '/uploads/posters/missionary-2024-jeju.jpg',
    description: '포스터 파일 경로 또는 URL (메타데이터만)',
  })
  @IsString()
  @IsNotEmpty()
  declare path: string;
}
