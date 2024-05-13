import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  auth0_id: string;

  @IsNotEmpty()
  @MaxLength(80)
  username?: string;

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  avatar?: string;

  country_id?: number;

  active?: boolean;
}
