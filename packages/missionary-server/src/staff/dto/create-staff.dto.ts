import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum MissionaryStaffRole {
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
}

export class CreateStaffDto {
  @ApiProperty({
    example: 'uuid-string',
    description: '선교 ID',
  })
  @IsUUID()
  @IsNotEmpty()
  declare missionaryId: string;

  @ApiProperty({
    example: 'uuid-string',
    description: '사용자 ID',
  })
  @IsUUID()
  @IsNotEmpty()
  declare userId: string;

  @ApiProperty({
    enum: ['LEADER', 'MEMBER'],
    description: '선교 스태프 역할',
  })
  @IsEnum(MissionaryStaffRole)
  @IsNotEmpty()
  declare role: MissionaryStaffRole;
}
