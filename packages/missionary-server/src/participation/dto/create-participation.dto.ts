import {
  IsUUID,
  IsString,
  IsDateString,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateParticipationDto {
  @IsUUID()
  declare missionaryId: string;

  @IsString()
  declare name: string;

  @IsDateString()
  declare birthDate: string;

  @IsInt()
  declare applyFee: number;

  @IsString()
  declare identificationNumber: string;

  @IsBoolean()
  declare isOwnCar: boolean;
}
