import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';

import { CreateAgreementDto } from './dto/create-agreement.dto';
import { CreateTermsDto } from './dto/create-terms.dto';
import { UpdateTermsDto } from './dto/update-terms.dto';
import { TermsService } from './terms.service';

@ApiTags('Terms')
@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '약관 생성 (관리자 전용)' })
  create(@Body() dto: CreateTermsDto) {
    return this.termsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '약관 목록 조회 (공개)' })
  findAll() {
    return this.termsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '약관 단건 조회 (공개)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.termsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '약관 수정 (관리자 전용)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTermsDto) {
    return this.termsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  @ApiOperation({ summary: '약관 삭제 (관리자 전용)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.termsService.remove(id);
  }

  @Post(':id/agreements')
  @ApiOperation({ summary: '약관 동의 (인증된 사용자)' })
  createAgreement(
    @Param('id', ParseUUIDPipe) termsId: string,
    @Body() dto: CreateAgreementDto,
  ) {
    return this.termsService.createAgreement(termsId, dto);
  }

  @Get('users/:userId/agreements')
  @ApiOperation({ summary: '사용자 약관 동의 목록 조회' })
  getUserAgreements(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.termsService.getUserAgreements(userId);
  }
}
