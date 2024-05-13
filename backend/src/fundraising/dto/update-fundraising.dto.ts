import { IsNotEmpty, Min } from 'class-validator';

export class UpdateFundraisingDto {
  @IsNotEmpty()
  @Min(1)
  goal_amount: number;

  @IsNotEmpty()
  @Min(1)
  initial_price: number;
}
