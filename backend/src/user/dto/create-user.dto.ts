import { IsEmail, IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  @MaxLength(80)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  avatar: string;
}
