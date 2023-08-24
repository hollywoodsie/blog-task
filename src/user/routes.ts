import { Router } from 'express';
import { userController } from '../user/user.controller';

const router = Router();

router.get('/me', userController.getMe.bind(userController));

export default router;
