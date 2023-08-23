import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.model';

export function userToUserResponseDto(user: User): UserResponseDto {
  return plainToInstance(UserResponseDto, user.toJSON(), {
    excludeExtraneousValues: true,
  });
}
