import { IsNotEmpty, Max, Min } from 'class-validator';

export class EditEventDto {
  @IsNotEmpty()
  start_date: Date;

  @IsNotEmpty()
  end_date: Date;
}
