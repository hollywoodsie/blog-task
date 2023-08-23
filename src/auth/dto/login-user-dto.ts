import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserAuthDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
