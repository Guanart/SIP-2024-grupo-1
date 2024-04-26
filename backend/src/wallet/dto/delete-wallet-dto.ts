import { IsNotEmpty } from 'class-validator';

export class DeleteWalletDto {
  @IsNotEmpty()
  wallet_id: number;
}
