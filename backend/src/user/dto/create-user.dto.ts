import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;
}
