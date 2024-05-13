import { IsNotEmpty } from 'class-validator';

export class CreatePreference {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  unit_price: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  id: number;
}
