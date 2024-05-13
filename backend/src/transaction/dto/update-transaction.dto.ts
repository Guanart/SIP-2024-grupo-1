import { IsNotEmpty} from 'class-validator';

export class UpdateTransactionDto {
  @IsNotEmpty()
  wallet_id: number;
  @IsNotEmpty()
  token_id: number;
  @IsNotEmpty()
  type_id: number;
  @IsNotEmpty()
  timestamp: Date;
}
