import { plainToInstance } from 'class-transformer';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { userToUserResponseDto } from '../user/converters';
import { User } from '../user/user.model';

export function userToRegisterResponseDto({
  user,
  token,
}: {
  user: User;
  token: string;
}): RegisterUserResponseDto {
  return plainToInstance(
    RegisterUserResponseDto,
    { user: userToUserResponseDto(user), token },
    {
      excludeExtraneousValues: true,
    }
  );
}
