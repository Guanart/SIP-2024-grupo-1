import { IsNotEmpty} from 'class-validator';

export class UpdateWalletDto {
  @IsNotEmpty()
  user_id?: number;

  @IsNotEmpty()
  cbu?: string;

  @IsNotEmpty()
  paypal_id?: string;
}
