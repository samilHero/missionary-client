import { PartialType } from '@nestjs/swagger';

import { CreateTermsDto } from './create-terms.dto';

export class UpdateTermsDto extends PartialType(CreateTermsDto) {}
