import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { CreateAgreementDto } from './dto/create-agreement.dto';
import { CreateTermsDto } from './dto/create-terms.dto';
import { UpdateTermsDto } from './dto/update-terms.dto';

@Injectable()
export class TermsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTermsDto) {
    return this.prisma.terms.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.terms.findMany({
      where: {
        deletedAt: null,
        isUsed: true,
      },
      orderBy: {
        seq: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const terms = await this.prisma.terms.findUnique({
      where: { id },
    });

    if (!terms || terms.deletedAt) {
      throw new NotFoundException(`Terms #${id}을 찾을 수 없습니다`);
    }

    return terms;
  }

  async update(id: string, dto: UpdateTermsDto) {
    await this.findOne(id);

    return this.prisma.terms.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.terms.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createAgreement(termsId: string, dto: CreateAgreementDto) {
    await this.findOne(termsId);

    const existing = await this.prisma.userTermsAgreement.findFirst({
      where: {
        termsId,
        userId: dto.userId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('이미 동의한 약관입니다');
    }

    return this.prisma.userTermsAgreement.create({
      data: {
        termsId,
        userId: dto.userId,
        isAgreed: dto.isAgreed ?? true,
      },
      include: {
        terms: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserAgreements(userId: string) {
    return this.prisma.userTermsAgreement.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        terms: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
