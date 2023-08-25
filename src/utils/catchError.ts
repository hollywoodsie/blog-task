import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../errors/http.exception';
import { UniqueConstraintError, BaseError as DatabaseError } from 'sequelize';
export function catchError(callback: (...args: any[]) => any) {
  return async function (
    this: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await callback.call(this, req, res, next);
    } catch (error) {
      console.error('An error occurred:', error);

      if (error instanceof HttpException) {
        handleHttpException(res, error);
        return;
      }

      if (error instanceof DatabaseError) {
        handleDatabaseError(res, error);
        return;
      }

      handleGenericError(res);
    }
  };
}
export function CatchError(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value as (...args: any[]) => any;

  descriptor.value = catchError(originalMethod);
}

function handleHttpException(res: Response, exception: HttpException) {
  res.status(exception.status).json({ error: exception.message });
}

function handleDatabaseError(res: Response, error: DatabaseError) {
  if (error instanceof UniqueConstraintError) {
    return handleUniqueConstraintError(res, error);
  }
}

function handleUniqueConstraintError(
  res: Response,
  error: UniqueConstraintError
) {
  res.status(409).send({ error: { fields: error.fields } });
}

function handleGenericError(res: Response) {
  res.status(500).json({ error: 'An error occurred' });
}
