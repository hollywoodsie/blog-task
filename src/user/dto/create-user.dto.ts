import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

import { PASSWORD_LENGTH } from '../constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  password: string;
}
