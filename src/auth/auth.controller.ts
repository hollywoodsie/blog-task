import { Request, Response } from 'express';
import AuthService from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import UserService from '../user/user.service';
import { UserAuthDto } from './dto/login-user-dto';

class AuthController {
  public async login(
    req: Request<unknown, unknown, UserAuthDto>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserService.findOneByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const passwordsMatch = await AuthService.comparePasswords(
        password,
        user.passwordHash
      );
      if (!passwordsMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = AuthService.generateAuthToken(user);

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async register(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ): Promise<void> {
    try {
      console.log(req.body);
      const createUserDto: CreateUserDto = req.body;
      const { user, token } = await AuthService.register(createUserDto);

      res.status(201).json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const authController = new AuthController();
export default authController;
