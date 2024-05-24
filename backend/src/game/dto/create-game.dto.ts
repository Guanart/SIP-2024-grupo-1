import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  icon: string;
}
