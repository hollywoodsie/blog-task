import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class RegisterUserResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
  @Expose()
  token: string;
}
