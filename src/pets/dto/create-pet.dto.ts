import { MinLength } from 'class-validator';

export class CreatePetDto {
  @MinLength(2)
  name!: string;
  age!: number;
  size!: number;
  weigth!: number;
  type!: string;
}
