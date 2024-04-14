import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  auth0_id: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
}
