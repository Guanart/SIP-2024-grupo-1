import { IsNotEmpty, Min } from 'class-validator';

export class SetFinalPositionDto {
  @IsNotEmpty()
  @Min(0)
  event_id: number;

  @IsNotEmpty()
  @Min(0)
  player_id: number;

  @Min(0)
  position: number;
}
