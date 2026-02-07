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
  Req,
  Response,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response as ExpressResponse } from 'express';

import { CsvExportService } from '@/common/csv/csv-export.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';

import { ApprovePaymentDto } from './dto/approve-payment.dto';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { ParticipationService } from './participation.service';

@ApiTags('Participations')
@Controller('participations')
export class ParticipationController {
  constructor(
    private readonly participationService: ParticipationService,
    private readonly csvExportService: CsvExportService,
  ) {}

  @Post()
  @ApiOperation({ summary: '참가 신청 생성 (비동기 처리)' })
  create(@Req() req: Request, @Body() dto: CreateParticipationDto) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    return this.participationService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: '참가 신청 목록 조회' })
  findAll(
    @Req() req: Request,
    @Query('missionaryId') missionaryId?: string,
    @Query('isPaid') isPaid?: string,
  ) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };

    const filters: any = {};

    if (missionaryId) {
      filters.missionaryId = missionaryId;
    }

    if (isPaid !== undefined) {
      filters.isPaid = isPaid === 'true';
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.STAFF) {
      filters.userId = user.id;
    }

    return this.participationService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: '참가 신청 단건 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.participationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '참가 신청 수정' })
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipationDto,
  ) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    return this.participationService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '참가 신청 삭제' })
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
      provider: string;
    };
    return this.participationService.remove(id, user.id);
  }

  @Put('approve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '참가비 납부 승인 (관리자 전용)' })
  approvePayments(@Body() dto: ApprovePaymentDto) {
    return this.participationService.approvePayments(dto.participationIds);
  }

  @Get('download/:missionaryId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: '참가 신청 CSV 다운로드 (관리자/스태프 전용)' })
  async downloadCsv(
    @Param('missionaryId', ParseUUIDPipe) missionaryId: string,
    @Response() res: ExpressResponse,
  ) {
    const participations = await this.participationService.findAll({
      missionaryId,
    });

    const csvBuffer =
      await this.csvExportService.generateParticipationCsv(participations);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="participations-${missionaryId}.csv"`,
    );
    res.send(csvBuffer);
  }
}
