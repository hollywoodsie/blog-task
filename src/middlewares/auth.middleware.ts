import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { userService } from '../user/user.service';
import DecodedToken from '../auth/types';
import { UnauthorizedException } from '../errors/unauthorized.exception';

const JWT_SECRET_KEY = process.env.JWT_SECRET as Secret;

const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    throw new UnauthorizedException('Access denied. Invalid token.');
  }

  const token = authorizationHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as DecodedToken;
    const user: User | null = await userService.findOneById(decoded.id);

    if (!user) {
      throw new UnauthorizedException('Access denied. Invalid token.');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedException('Access denied. Invalid token.');
  }
};

export default jwtAuthMiddleware;
