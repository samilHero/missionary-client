import { IsOptional, IsString } from 'class-validator';

export class CreateChurchDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  pastorName?: string;

  @IsOptional()
  @IsString()
  pastorPhone?: string;

  @IsOptional()
  @IsString()
  addressBasic?: string;

  @IsOptional()
  @IsString()
  addressDetail?: string;
}
