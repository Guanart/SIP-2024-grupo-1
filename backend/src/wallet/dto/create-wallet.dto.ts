import { IsNotEmpty, MaxLength, Min, MinLength } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @Min(1)
  user_id: number;

  @MaxLength(22)
  @MinLength(22)
  @IsNotEmpty()
  cbu: string;

  @MaxLength(250)
  @IsNotEmpty()
  paypal_id: string;
}
