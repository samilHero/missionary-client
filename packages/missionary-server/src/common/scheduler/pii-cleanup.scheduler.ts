import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class PiiCleanupScheduler {
  private readonly logger = new Logger(PiiCleanupScheduler.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * *') // Daily at midnight
  async cleanupOldPii() {
    try {
      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Find and update participations soft-deleted > 30 days ago
      const result = await this.prisma.participation.updateMany({
        where: {
          deletedAt: {
            lt: thirtyDaysAgo,
          },
        },
        data: {
          identificationNumber: null,
        },
      });

      this.logger.log(
        `Cleaned up PII for ${result.count} participations deleted more than 30 days ago`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup PII', error);
    }
  }
}
