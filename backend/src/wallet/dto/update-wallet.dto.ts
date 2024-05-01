import { IsNotEmpty, MaxLength, MinLength, Min } from 'class-validator';

export class UpdateWalletDto {
  @IsNotEmpty()
  @Min(1)
  wallet_id?: number;

  @MaxLength(22)
  @MinLength(22)
  @IsNotEmpty()
  cbu?: string;

  @MaxLength(250)
  @IsNotEmpty()
  paypal_id?: string;
}
