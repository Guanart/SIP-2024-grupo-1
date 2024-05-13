import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdatePlayerDto {
  @IsNotEmpty()
  player_id: number;

  @MaxLength(200)
  biography?: string;
}
