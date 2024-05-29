import { IsNotEmpty, Min } from 'class-validator';

export class RegisterPlayerDto {
  @IsNotEmpty()
  @Min(0)
  event_id: number;

  @IsNotEmpty()
  @Min(0)
  player_id: number;

  position?: number;
}
