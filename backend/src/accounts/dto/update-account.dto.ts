import { IsNotEmpty } from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty()
  auth0_id: string;

  username: string;

  avatar: string;

  country: string;

  biography: string;
}
