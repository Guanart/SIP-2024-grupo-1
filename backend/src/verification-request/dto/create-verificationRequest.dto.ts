import {IsNotEmpty, Min, IsEnum} from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class CreateVerificationRequestDto {
  @IsNotEmpty()
  @Min(1)
  user_id: number;

  @IsNotEmpty()
  @Min(1)
  game_id: number;

  @IsNotEmpty()
  rank_id: number;

  @IsNotEmpty()
  filepath: string;

  //@IsNotEmpty()
  createdAt: Date = new Date();

  @IsEnum(RequestStatus)
  status: RequestStatus = RequestStatus.PENDING;
}

/*model VerificationRequest {
  user_id   Int
  game_id   Int
  status    RequestStatus @default(PENDING)
  rank_id   Int
  filepath  String
  createdAt DateTime      @default(now())
} */
