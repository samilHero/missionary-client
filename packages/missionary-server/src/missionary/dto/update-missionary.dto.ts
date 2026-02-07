import { PartialType } from '@nestjs/mapped-types';

import { CreateMissionaryDto } from './create-missionary.dto';

export class UpdateMissionaryDto extends PartialType(CreateMissionaryDto) {}
