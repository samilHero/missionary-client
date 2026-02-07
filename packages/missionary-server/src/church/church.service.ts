import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { CreateChurchDto } from './dto/create-church.dto';
import { UpdateChurchDto } from './dto/update-church.dto';

@Injectable()
export class ChurchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChurchDto: CreateChurchDto) {
    return this.prisma.church.create({
      data: createChurchDto,
    });
  }

  async findAll() {
    return this.prisma.church.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const church = await this.prisma.church.findUnique({
      where: { id },
    });

    if (!church) {
      throw new NotFoundException(`Church #${id}을 찾을 수 없습니다`);
    }

    return church;
  }

  async update(id: string, updateChurchDto: UpdateChurchDto) {
    await this.findOne(id); // Verify exists

    return this.prisma.church.update({
      where: { id },
      data: updateChurchDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.church.delete({
      where: { id },
    });
  }
}
