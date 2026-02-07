import { PartialType } from '@nestjs/mapped-types';

import { CreateMissionaryChurchDto } from './create-missionary-church.dto';

export class UpdateMissionaryChurchDto extends PartialType(
  CreateMissionaryChurchDto,
) {}
