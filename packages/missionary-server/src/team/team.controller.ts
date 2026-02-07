import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';

import { AddMembersDto } from './dto/add-members.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '팀 생성 (관리자/스태프 전용)' })
  create(@Body() dto: CreateTeamDto) {
    return this.teamService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '팀 목록 조회' })
  @ApiQuery({
    name: 'missionaryId',
    required: false,
    description: '선교 ID로 필터링',
  })
  findAll(@Query('missionaryId') missionaryId?: string) {
    return this.teamService.findAll(missionaryId);
  }

  @Get(':id')
  @ApiOperation({ summary: '팀 단건 조회 (멤버 포함)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '팀 수정 (관리자/스태프 전용)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTeamDto) {
    return this.teamService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '팀 삭제 (관리자/스태프 전용)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamService.remove(id);
  }

  @Put(':id/members')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '팀 멤버 추가 (관리자/스태프 전용)' })
  addMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMembersDto,
  ) {
    return this.teamService.addMembers(id, dto);
  }

  @Delete(':id/members')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '팀 멤버 제거 (관리자/스태프 전용)' })
  removeMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMembersDto,
  ) {
    return this.teamService.removeMembers(id, dto);
  }
}
