import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../user/user.model';
import UserService from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { userToRegisterResponseDto } from './converter';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';

class AuthService {
  private readonly JWT_SECRET = 'your-secret-key';
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
    return await bcrypt.compare(providedPassword, storedPasswordHash);
  }

  public async register(
    createUserDto: CreateUserDto
  ): Promise<RegisterUserResponseDto> {
    const newUser = await UserService.create(createUserDto);
    const token = this.generateAuthToken(newUser);

    // const { passwordHash, ...userWithoutPass} = newUser.toJSON();

    return userToRegisterResponseDto({ user: newUser, token });
  }
}
export default new AuthService();
