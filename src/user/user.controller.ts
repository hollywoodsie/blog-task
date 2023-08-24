import { Request, Response } from 'express';

import { userToUserResponseDto } from './converters';
import { CatchError } from '../utils/catchError';

class UserController {
  @CatchError
  public getMe(req: Request, res: Response) {
    res.status(200).send(userToUserResponseDto(req.user!));
  }
}

export const userController = new UserController();
