import { IsNotEmpty, IsEnum} from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class UpdateVerificationRequestDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  user_id: number;
  @IsNotEmpty()
  createdAt: Date;
  @IsEnum(RequestStatus)
  status: RequestStatus;
}