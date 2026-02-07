import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.missionaryRegion.create({
      data: createRegionDto,
    });
  }

  async findAll() {
    return this.prisma.missionaryRegion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const region = await this.prisma.missionaryRegion.findUnique({
      where: { id },
    });

    if (!region) {
      throw new NotFoundException(`Region #${id}을 찾을 수 없습니다`);
    }

    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    await this.findOne(id); // Verify exists

    return this.prisma.missionaryRegion.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists

    return this.prisma.missionaryRegion.delete({
      where: { id },
    });
  }
}
