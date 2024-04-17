import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  username: string;

  @IsUrl()
  avatar: string;

  country: string;
}
