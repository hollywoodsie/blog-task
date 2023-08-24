import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(error?: string) {
    super(404, error);
  }
}
