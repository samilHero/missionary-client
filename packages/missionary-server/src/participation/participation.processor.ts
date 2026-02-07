import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { encrypt } from '@/common/utils/encryption';
import { PrismaService } from '@/database/prisma.service';

import type { CreateParticipationDto } from './dto/create-participation.dto';

@Processor('participation-queue')
@Injectable()
export class ParticipationProcessor extends WorkerHost {
  private readonly logger = new Logger(ParticipationProcessor.name);
  private readonly encryptKey: string;

  constructor(private readonly prisma: PrismaService) {
    super();
    this.encryptKey = process.env.AES_ENCRYPT_KEY || '';

    if (!this.encryptKey) {
      throw new Error('AES_ENCRYPT_KEY is not configured');
    }
  }

  async process(job: Job<{ dto: CreateParticipationDto; userId: string }>) {
    const { dto, userId } = job.data;

    this.logger.log(
      `Processing participation creation for user ${userId}, missionary ${dto.missionaryId}`,
    );

    const missionary = await this.prisma.missionary.findUnique({
      where: { id: dto.missionaryId },
    });

    if (!missionary) {
      throw new ConflictException('Missionary not found');
    }

    if (
      missionary.maximumParticipantCount !== null &&
      missionary.currentParticipantCount >= missionary.maximumParticipantCount
    ) {
      throw new ConflictException('Missionary is at full capacity');
    }

    const encryptedIdentificationNumber = encrypt(
      dto.identificationNumber,
      this.encryptKey,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const participation = await tx.participation.create({
        data: {
          name: dto.name,
          birthDate: dto.birthDate,
          applyFee: dto.applyFee,
          identificationNumber: encryptedIdentificationNumber,
          isOwnCar: dto.isOwnCar,
          missionaryId: dto.missionaryId,
          userId,
          createdBy: userId,
        },
        include: {
          missionary: true,
          user: true,
        },
      });

      await tx.missionary.update({
        where: { id: dto.missionaryId },
        data: {
          currentParticipantCount: { increment: 1 },
        },
      });

      return participation;
    });

    this.logger.log(
      `Successfully created participation ${result.id} for missionary ${dto.missionaryId}`,
    );

    return result;
  }
}
