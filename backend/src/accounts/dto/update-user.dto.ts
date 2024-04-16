import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  username: string;

  avatar: string;

  country: string;

}
