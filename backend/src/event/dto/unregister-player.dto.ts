import { IsNotEmpty, Min } from 'class-validator';

export class UnregisterPlayerDto {
  @IsNotEmpty()
  @Min(0)
  event_id: number;

  @IsNotEmpty()
  @Min(0)
  player_id: number;
}
