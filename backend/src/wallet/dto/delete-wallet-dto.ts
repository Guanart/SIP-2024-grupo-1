import { IsNotEmpty } from 'class-validator';

export class DeleteWalletDto {
  @IsNotEmpty()
  id: number;
}
