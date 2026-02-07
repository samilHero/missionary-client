import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { AddMembersDto } from './dto/add-members.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Prisma } from '../../prisma/generated/prisma';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        missionaryId: dto.missionaryId,
        churchId: dto.churchId,
        leaderUserId: dto.leaderUserId,
        leaderUserName: dto.leaderUserName,
        teamName: dto.teamName,
      },
      include: {
        missionary: true,
        church: true,
        teamMembers: {
          where: {
            deletedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(missionaryId?: string) {
    const where: Prisma.TeamWhereInput = {
      deletedAt: null,
    };

    if (missionaryId) {
      where.missionaryId = missionaryId;
    }

    return this.prisma.team.findMany({
      where,
      include: {
        missionary: true,
        church: true,
        teamMembers: {
          where: {
            deletedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        missionary: true,
        church: true,
        teamMembers: {
          where: {
            deletedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!team || team.deletedAt) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, dto: UpdateTeamDto) {
    await this.findOne(id);

    const data: Prisma.TeamUpdateInput = {};

    if (dto.missionaryId !== undefined) {
      data.missionary = { connect: { id: dto.missionaryId } };
    }
    if (dto.churchId !== undefined) {
      data.church = dto.churchId
        ? { connect: { id: dto.churchId } }
        : { disconnect: true };
    }
    if (dto.leaderUserId !== undefined) data.leaderUserId = dto.leaderUserId;
    if (dto.leaderUserName !== undefined)
      data.leaderUserName = dto.leaderUserName;
    if (dto.teamName !== undefined) data.teamName = dto.teamName;

    return this.prisma.team.update({
      where: { id },
      data,
      include: {
        missionary: true,
        church: true,
        teamMembers: {
          where: {
            deletedAt: null,
          },
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.team.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async addMembers(teamId: string, dto: AddMembersDto) {
    await this.findOne(teamId);

    const createPromises = dto.userIds.map((userId) =>
      this.prisma.teamMember.create({
        data: {
          teamId,
          userId,
        },
      }),
    );

    await Promise.all(createPromises);

    return this.findOne(teamId);
  }

  async removeMembers(teamId: string, dto: AddMembersDto) {
    await this.findOne(teamId);

    const updatePromises = dto.userIds.map((userId) =>
      this.prisma.teamMember.updateMany({
        where: {
          teamId,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
    );

    await Promise.all(updatePromises);

    return this.findOne(teamId);
  }
}
