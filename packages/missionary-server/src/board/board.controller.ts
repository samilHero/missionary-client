import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { MissionaryBoardType } from '@/common/enums/missionary-board-type.enum';
import { UserRole } from '@/common/enums/user-role.enum';

import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('Board')
@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('missionaries/:missionaryId/boards')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '선교 게시글 생성 (관리자/스태프 전용)' })
  create(
    @Param('missionaryId', ParseUUIDPipe) missionaryId: string,
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardService.create({ ...dto, missionaryId });
  }

  @Get('missionaries/:missionaryId/boards')
  @ApiOperation({ summary: '선교별 게시글 목록 조회 (타입 필터링 지원)' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['NOTICE', 'BUS', 'ACCOMMODATION', 'FAQ', 'SCHEDULE'],
    description: '게시판 타입 필터',
  })
  findByMissionary(
    @Param('missionaryId', ParseUUIDPipe) missionaryId: string,
    @Query('type') type?: MissionaryBoardType,
  ) {
    return this.boardService.findByMissionary(missionaryId, type);
  }

  @Get('boards/:id')
  @ApiOperation({ summary: '게시글 단건 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.findOne(id);
  }

  @Patch('boards/:id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '게시글 수정 (관리자/스태프 전용)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBoardDto) {
    return this.boardService.update(id, dto);
  }

  @Delete('boards/:id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '게시글 삭제 (관리자/스태프 전용)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.remove(id);
  }
}
