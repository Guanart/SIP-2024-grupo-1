import { IsNotEmpty } from 'class-validator';

export class DeleteGameDto {
  @IsNotEmpty()
  id: string;
}
