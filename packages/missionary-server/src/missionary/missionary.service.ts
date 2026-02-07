import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { CreateMissionaryChurchDto } from './dto/create-missionary-church.dto';
import { CreateMissionaryPosterDto } from './dto/create-missionary-poster.dto';
import { CreateMissionaryDto } from './dto/create-missionary.dto';
import { UpdateMissionaryDto } from './dto/update-missionary.dto';

@Injectable()
export class MissionaryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateMissionaryDto) {
    return this.prisma.missionary.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        pastorName: dto.pastorName,
        pastorPhone: dto.pastorPhone,
        participationStartDate: new Date(dto.participationStartDate),
        participationEndDate: new Date(dto.participationEndDate),
        price: dto.price,
        description: dto.description,
        maximumParticipantCount: dto.maximumParticipantCount,
        bankName: dto.bankName,
        bankAccountHolder: dto.bankAccountHolder,
        bankAccountNumber: dto.bankAccountNumber,
        regionId: dto.regionId,
        createdById: userId,
        status: dto.status,
      },
      include: {
        region: true,
      },
    });
  }

  async findAll() {
    return this.prisma.missionary.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        region: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const missionary = await this.prisma.missionary.findUnique({
      where: { id },
      include: {
        region: true,
        posters: true,
        churches: true,
      },
    });

    if (!missionary) {
      throw new NotFoundException(`Missionary with ID ${id} not found`);
    }

    if (missionary.deletedAt !== null) {
      throw new NotFoundException(`Missionary with ID ${id} has been deleted`);
    }

    return missionary;
  }

  async update(id: string, dto: UpdateMissionaryDto) {
    await this.findOne(id);

    const data: Record<string, any> = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (dto.pastorName !== undefined) data.pastorName = dto.pastorName;
    if (dto.pastorPhone !== undefined) data.pastorPhone = dto.pastorPhone;
    if (dto.participationStartDate !== undefined)
      data.participationStartDate = new Date(dto.participationStartDate);
    if (dto.participationEndDate !== undefined)
      data.participationEndDate = new Date(dto.participationEndDate);
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.maximumParticipantCount !== undefined)
      data.maximumParticipantCount = dto.maximumParticipantCount;
    if (dto.bankName !== undefined) data.bankName = dto.bankName;
    if (dto.bankAccountHolder !== undefined)
      data.bankAccountHolder = dto.bankAccountHolder;
    if (dto.bankAccountNumber !== undefined)
      data.bankAccountNumber = dto.bankAccountNumber;
    if (dto.regionId !== undefined) data.regionId = dto.regionId;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.missionary.update({
      where: { id },
      data,
      include: {
        region: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.missionary.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async addChurch(missionaryId: string, dto: CreateMissionaryChurchDto) {
    await this.findOne(missionaryId);

    return this.prisma.missionaryChurch.create({
      data: {
        missionaryId,
        name: dto.name,
        visitPurpose: dto.visitPurpose,
        pastorName: dto.pastorName,
        pastorPhone: dto.pastorPhone,
        addressBasic: dto.addressBasic,
        addressDetail: dto.addressDetail,
      },
    });
  }

  async getChurches(missionaryId: string) {
    await this.findOne(missionaryId);

    return this.prisma.missionaryChurch.findMany({
      where: { missionaryId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removeChurch(missionaryId: string, churchId: string) {
    await this.findOne(missionaryId);

    const church = await this.prisma.missionaryChurch.findFirst({
      where: {
        id: churchId,
        missionaryId,
      },
    });

    if (!church) {
      throw new NotFoundException(
        `MissionaryChurch with ID ${churchId} not found for missionary ${missionaryId}`,
      );
    }

    return this.prisma.missionaryChurch.delete({
      where: { id: churchId },
    });
  }

  async addPoster(missionaryId: string, dto: CreateMissionaryPosterDto) {
    await this.findOne(missionaryId);

    return this.prisma.missionaryPoster.create({
      data: {
        missionaryId,
        name: dto.name,
        path: dto.path,
      },
    });
  }

  async getPosters(missionaryId: string) {
    await this.findOne(missionaryId);

    return this.prisma.missionaryPoster.findMany({
      where: { missionaryId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removePoster(missionaryId: string, posterId: string) {
    await this.findOne(missionaryId);

    const poster = await this.prisma.missionaryPoster.findFirst({
      where: {
        id: posterId,
        missionaryId,
      },
    });

    if (!poster) {
      throw new NotFoundException(
        `MissionaryPoster with ID ${posterId} not found for missionary ${missionaryId}`,
      );
    }

    return this.prisma.missionaryPoster.delete({
      where: { id: posterId },
    });
  }
}
