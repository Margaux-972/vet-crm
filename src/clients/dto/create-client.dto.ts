import { MinLength } from 'class-validator';

export class CreateClientDto {
  civility!: string;
  @MinLength(2)
  name!: string;
  lastName!: string;
  email!: string;
  phone!: number;
  pet!: string;
}
