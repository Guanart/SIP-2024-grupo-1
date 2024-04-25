import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  @IsNotEmpty()
  username?: string;

  @IsNotEmpty()
  @IsUrl()
  avatar?: string;

  country?: string;

  active?: boolean;
}
