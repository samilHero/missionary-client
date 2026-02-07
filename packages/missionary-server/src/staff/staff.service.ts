import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStaffDto) {
    // Check unique constraint: missionaryId + userId
    const existing = await this.prisma.missionaryStaff.findFirst({
      where: {
        missionaryId: dto.missionaryId,
        userId: dto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('User already assigned to this missionary');
    }

    return this.prisma.missionaryStaff.create({
      data: {
        missionaryId: dto.missionaryId,
        userId: dto.userId,
        role: dto.role,
      },
      include: {
        missionary: true,
        user: true,
      },
    });
  }

  async findByMissionary(missionaryId: string) {
    return this.prisma.missionaryStaff.findMany({
      where: {
        missionaryId,
        deletedAt: null,
      },
      include: {
        missionary: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const staff = await this.prisma.missionaryStaff.findUnique({
      where: { id },
      include: {
        missionary: true,
        user: true,
      },
    });

    if (!staff || staff.deletedAt) {
      throw new NotFoundException(`Staff assignment with ID ${id} not found`);
    }

    return staff;
  }

  async update(id: string, dto: UpdateStaffDto) {
    await this.findOne(id);

    const data: Record<string, any> = {};

    if (dto.role !== undefined) data.role = dto.role;

    return this.prisma.missionaryStaff.update({
      where: { id },
      data,
      include: {
        missionary: true,
        user: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.missionaryStaff.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        missionary: true,
        user: true,
      },
    });
  }
}
