import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { MissionaryBoardType } from '@/common/enums/missionary-board-type.enum';

export class CreateBoardDto {
  @ApiProperty({
    example: 'uuid-string',
    description: '선교 ID',
  })
  @IsUUID()
  @IsNotEmpty()
  declare missionaryId: string;

  @ApiProperty({
    enum: ['NOTICE', 'BUS', 'ACCOMMODATION', 'FAQ', 'SCHEDULE'],
    description: '게시판 타입',
  })
  @IsEnum(MissionaryBoardType)
  @IsNotEmpty()
  declare type: MissionaryBoardType;

  @ApiProperty({
    example: '공지사항 제목',
    description: '게시글 제목',
  })
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @ApiProperty({
    example: '게시글 내용입니다.',
    description: '게시글 내용',
  })
  @IsString()
  @IsNotEmpty()
  declare content: string;
}
