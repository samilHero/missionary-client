import { Module } from '@nestjs/common';

import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';

@Module({
  controllers: [TermsController],
  providers: [TermsService],
  exports: [TermsService],
})
export class TermsModule {}
