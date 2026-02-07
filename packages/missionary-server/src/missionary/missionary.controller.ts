import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';

import { CreateMissionaryChurchDto } from './dto/create-missionary-church.dto';
import { CreateMissionaryPosterDto } from './dto/create-missionary-poster.dto';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';
import { MissionaryService } from './missionary.service';

@ApiTags('Missionaries')
@Controller('missionaries')
export class MissionaryController {
  constructor(private readonly missionaryService: MissionaryService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 생성 (관리자 전용)' })
  create(@Req() req: Request, @Body() dto: CreateMissionaryDto) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    return this.missionaryService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '선교 목록 조회' })
  findAll() {
    return this.missionaryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '선교 단건 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionaryService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 수정 (관리자 전용)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMissionaryDto,
  ) {
    return this.missionaryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 삭제 (관리자 전용)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionaryService.remove(id);
  }

  @Post(':id/churches')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 교회 추가 (관리자 전용)' })
  addChurch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMissionaryChurchDto,
  ) {
    return this.missionaryService.addChurch(id, dto);
  }

  @Get(':id/churches')
  @ApiOperation({ summary: '선교 교회 목록 조회' })
  getChurches(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionaryService.getChurches(id);
  }

  @Delete(':id/churches/:churchId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 교회 제거 (관리자 전용)' })
  removeChurch(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('churchId', ParseUUIDPipe) churchId: string,
  ) {
    return this.missionaryService.removeChurch(id, churchId);
  }

  @Post(':id/posters')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 포스터 추가 (관리자 전용)' })
  addPoster(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateMissionaryPosterDto,
  ) {
    return this.missionaryService.addPoster(id, dto);
  }

  @Get(':id/posters')
  @ApiOperation({ summary: '선교 포스터 목록 조회' })
  getPosters(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionaryService.getPosters(id);
  }

  @Delete(':id/posters/:posterId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '선교 포스터 제거 (관리자 전용)' })
  removePoster(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('posterId', ParseUUIDPipe) posterId: string,
  ) {
    return this.missionaryService.removePoster(id, posterId);
  }
}
