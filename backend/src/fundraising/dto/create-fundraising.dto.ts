import { IsNotEmpty } from 'class-validator';

export class CreateFundraisingDto {
  @IsNotEmpty()
  goal_amount: number;

  @IsNotEmpty()
  prize_percentage: number;

  @IsNotEmpty()
  player_id: number;

  @IsNotEmpty()
  event_id: number;
}
