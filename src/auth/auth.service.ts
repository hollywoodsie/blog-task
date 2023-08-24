import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import { userService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { userToRegisterResponseDto } from './converter';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET as Secret;
  private readonly JWT_EXPIRATION = '1h';

  public generateAuthToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRATION,
    });
    return token;
  }

  public async comparePasswords(
    providedPassword: string,
    storedPasswordHash: string
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPasswordHash);
  }

  public async register(
    createUserDto: CreateUserDto
  ): Promise<RegisterUserResponseDto> {
    const newUser = await userService.create(createUserDto);
    const token = this.generateAuthToken(newUser);

    return userToRegisterResponseDto({ user: newUser, token });
  }
}
export const authService = new AuthService();
