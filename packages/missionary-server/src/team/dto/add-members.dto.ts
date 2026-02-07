import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AddMembersDto {
  @ApiProperty({
    example: ['uuid-string-1', 'uuid-string-2'],
    description: '추가할 사용자 ID 목록',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  declare userIds: string[];
}
