import { MinLength, IsEnum } from 'class-validator';

export enum PetSpecies {
  CHIEN = 'chien',
  CHAT = 'chat',
  HAMSTER = 'hamster',
  TORTUE = 'tortue',
}

export class CreatePetDto {
  @MinLength(2)
  name!: string;
  age!: number;
  size!: number;
  weight!: number;
  @IsEnum(PetSpecies)
  species!: string;

  clientId!: number;
}
