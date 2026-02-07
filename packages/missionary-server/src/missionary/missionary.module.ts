import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/prisma.module';

import { MissionaryController } from './missionary.controller';
import { MissionaryService } from './missionary.service';

@Module({
  imports: [PrismaModule],
  controllers: [MissionaryController],
  providers: [MissionaryService],
  exports: [MissionaryService],
})
export class MissionaryModule {}
