import { PartialType } from '@nestjs/mapped-types';

import { CreateMissionaryPosterDto } from './create-missionary-poster.dto';

export class UpdateMissionaryPosterDto extends PartialType(
  CreateMissionaryPosterDto,
) {}
