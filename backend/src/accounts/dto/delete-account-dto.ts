import { IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @IsNotEmpty()
  auth0_id: string;
}
