import { TransactionType } from '@prisma/client';
import {IsNotEmpty} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  wallet_id: number;
  @IsNotEmpty()
  token_id: number;
  @IsNotEmpty()
  type: TransactionType;
  @IsNotEmpty()
  timestamp: Date;
}
