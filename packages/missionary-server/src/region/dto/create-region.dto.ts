import { IsEnum, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name!: string;

  @IsEnum(['DOMESTIC', 'ABROAD'])
  type!: 'DOMESTIC' | 'ABROAD';
}
