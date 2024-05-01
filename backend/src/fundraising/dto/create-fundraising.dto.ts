import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFundraisingDto {
  @IsNotEmpty()
  @Min(1)
  goal_amount: number;

  @IsNotEmpty()
  @Min(1)
  initial_price: number;

  @Min(0)
  @Max(100)
  @IsNotEmpty()
  prize_percentage: number;

  @Min(1)
  @IsNotEmpty()
  player_id: number;

  @Min(1)
  @IsNotEmpty()
  event_id: number;
}
