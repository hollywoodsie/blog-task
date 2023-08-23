import { Router } from 'express';
import authController from '../auth/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserAuthDto } from './dto/login-user-dto';

const router = Router();

router.post(
  '/login',
  validationMiddleware({ bodyDto: UserAuthDto }),
  authController.login.bind(authController)
);
router.post(
  '/register',
  validationMiddleware({ bodyDto: CreateUserDto }),
  authController.register.bind(authController)
);

export default router;
