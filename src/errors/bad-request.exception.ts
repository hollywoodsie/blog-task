import { HttpException } from './http.exception';
export class BadRequestException extends HttpException {
  constructor(error?: string) {
    super(400, error);
  }
}
