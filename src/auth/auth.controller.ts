import { Request, Response } from 'express';
import { authService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { userService } from '../user/user.service';
import { UserAuthDto } from './dto/login-user-dto';
import { CatchError } from '../utils/catchError';
import { UnauthorizedException } from '../errors/unauthorized.exception';

class AuthController {
  @CatchError
  public async login(
    req: Request<unknown, unknown, UserAuthDto>,
    res: Response
  ): Promise<void> {
    const { email, password } = req.body;

    const user = await userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordsMatch = await authService.comparePasswords(
      password,
      user.passwordHash
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = authService.generateAuthToken(user);

    res.status(200).json({ token });
  }

  @CatchError
  public async register(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ): Promise<void> {
    console.log(req.body);
    const createUserDto: CreateUserDto = req.body;
    const { user, token } = await authService.register(createUserDto);

    res.status(201).json({ user, token });
  }
}

export const authController = new AuthController();
