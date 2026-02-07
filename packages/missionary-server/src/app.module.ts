import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ChurchModule } from './church/church.module';
import { RolesGuard } from './common/guards/roles.guard';
import { BullModule } from './common/queue/bull.module';
import { PrismaModule } from './database/prisma.module';
import { MissionaryModule } from './missionary/missionary.module';
import { ParticipationModule } from './participation/participation.module';
import { RegionModule } from './region/region.module';
import { StaffModule } from './staff/staff.module';
import { TeamModule } from './team/team.module';
import { TermsModule } from './terms/terms.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule,
    PrismaModule,
    UserModule,
    AuthModule,
    RegionModule,
    ChurchModule,
    MissionaryModule,
    StaffModule,
    ParticipationModule,
    TeamModule,
    BoardModule,
    TermsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
