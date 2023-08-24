import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(error?: string) {
    super(401, error);
  }
}
