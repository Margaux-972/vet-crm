import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';

export enum Civility {
  MR = 'Mr',
  MRS = 'Mme',
}

export class CreateClientDto {
  @IsEnum(Civility)
  civility!: Civility;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^[0-9+\s]+$/, {
    message: 'Veuillez entrer un numéro de téléphone valide',
  })
  phone!: string;
}
