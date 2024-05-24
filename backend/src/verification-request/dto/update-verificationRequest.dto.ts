import { IsNotEmpty, IsEnum} from 'class-validator';
import { Transform } from 'class-transformer';
import { RequestStatus } from '@prisma/client';

export class UpdateVerificationRequestDto {
  @IsNotEmpty()
  id: number;
  //@IsNotEmpty()
  //user_id: number;
  //@IsNotEmpty()
  //createdAt: Date;
  @Transform(({ value }) => RequestStatus[value as keyof typeof RequestStatus]) // Transforma la cadena en un enum
  @IsEnum(RequestStatus)
  status: RequestStatus;
}