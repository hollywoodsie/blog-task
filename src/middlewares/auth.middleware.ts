import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import UserService from '../user/user.service';
import DecodedToken from '../auth/types';
const secretKey = 'your-secret-key';

const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  const token = authorizationHeader.substring(7);

  try {
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    const user: User | null = await UserService.findOneById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Access denied. Invalid token.' });
  }
};

export default jwtAuthMiddleware;
