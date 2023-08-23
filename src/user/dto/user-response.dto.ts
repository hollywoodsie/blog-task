import { Expose } from 'class-transformer';
import { UserRole } from '../user.model';

export class UserResponseDto {
  @Expose() id: number;

  @Expose() role: UserRole;

  @Expose() name: string;

  @Expose() email: string;

  @Expose() createdAt: Date;

  @Expose() updatedAt: Date;
}
