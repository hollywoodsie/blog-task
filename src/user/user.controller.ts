import { Request, Response } from 'express';

import { userToUserResponseDto } from './converters';

class UserController {
  public getMe(req: Request, res: Response) {
    res.status(200).send(userToUserResponseDto(req.user!));
  }
}

const userController = new UserController();
export default userController;
