import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Min(0)
  prize: number;

  @Min(0)
  @IsNotEmpty()
  game_id: number;

  @Min(1)
  @IsNotEmpty()
  max_players: number;

  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;
}
