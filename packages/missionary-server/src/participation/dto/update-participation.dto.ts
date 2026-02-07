import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateParticipationDto } from './create-participation.dto';

export class UpdateParticipationDto extends PartialType(
  CreateParticipationDto,
) {
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
