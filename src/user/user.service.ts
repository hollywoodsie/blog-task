import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './user.model';
import bcrypt from 'bcrypt';
import { PASSWORD_HASH_ROUNDS } from './constants';

class UserService {
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      PASSWORD_HASH_ROUNDS
    );

    return User.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: UserRole.Blogger,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public async findOneById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }
}
export const userService = new UserService();
