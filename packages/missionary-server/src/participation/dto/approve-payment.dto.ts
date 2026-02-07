import { IsArray, IsUUID } from 'class-validator';

export class ApprovePaymentDto {
  @IsArray()
  @IsUUID('4', { each: true })
  declare participationIds: string[];
}
