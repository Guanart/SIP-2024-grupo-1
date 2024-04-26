import { IsNotEmpty } from 'class-validator';

export class UpdateWalletDto {
  @IsNotEmpty()
  wallet_id?: number;

  @IsNotEmpty()
  cbu?: string;

  @IsNotEmpty()
  paypal_id?: string;
}
