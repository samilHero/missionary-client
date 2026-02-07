import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';

import { ChurchService } from './church.service';
import { CreateChurchDto } from './dto/create-church.dto';
import { UpdateChurchDto } from './dto/update-church.dto';

@ApiTags('Churches')
@Controller('churches')
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '교회 생성 (관리자/스태프 전용)' })
  create(@Body() createChurchDto: CreateChurchDto) {
    return this.churchService.create(createChurchDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 교회 조회' })
  findAll() {
    return this.churchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '교회 단건 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '교회 정보 수정 (관리자/스태프 전용)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChurchDto: UpdateChurchDto,
  ) {
    return this.churchService.update(id, updateChurchDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '교회 삭제 (관리자/스태프 전용)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.churchService.remove(id);
  }
}
