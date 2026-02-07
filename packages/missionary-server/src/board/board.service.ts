import { Injectable, NotFoundException } from '@nestjs/common';

import { MissionaryBoardType } from '@/common/enums/missionary-board-type.enum';
import { PrismaService } from '@/database/prisma.service';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBoardDto) {
    return this.prisma.missionaryBoard.create({
      data: {
        missionaryId: dto.missionaryId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
      },
      include: {
        missionary: true,
      },
    });
  }

  async findByMissionary(missionaryId: string, type?: MissionaryBoardType) {
    return this.prisma.missionaryBoard.findMany({
      where: {
        missionaryId,
        type,
        deletedAt: null,
      },
      include: {
        missionary: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const board = await this.prisma.missionaryBoard.findUnique({
      where: { id },
      include: {
        missionary: true,
      },
    });

    if (!board || board.deletedAt) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  async update(id: string, dto: UpdateBoardDto) {
    await this.findOne(id);

    const data: Record<string, any> = {};

    if (dto.type !== undefined) data.type = dto.type;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.content !== undefined) data.content = dto.content;

    return this.prisma.missionaryBoard.update({
      where: { id },
      data,
      include: {
        missionary: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.missionaryBoard.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        missionary: true,
      },
    });
  }
}
