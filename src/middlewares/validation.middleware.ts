import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async (
  dto: new () => object,
  obj: object,
  skipMissingProperties = false
) => {
  const dtoObj = plainToInstance(dto, obj);
  const errors = await validate(dtoObj, { skipMissingProperties });

  return errors.length
    ? errors.filter((error) => error.constraints)
    : undefined;
};

export const validationMiddleware = ({
  queryDto,
  paramsDto,
  bodyDto,
}: {
  queryDto?: new () => object;
  paramsDto?: new () => object;
  bodyDto?: new () => object;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [queryErrors, paramsErrors, bodyErrors] = await Promise.all([
        queryDto && validateDto(queryDto, req.query),
        paramsDto && validateDto(paramsDto, req.params),
        bodyDto && validateDto(bodyDto, req.body as object),
      ]);
      if (queryErrors || paramsErrors || bodyErrors) {
        res.status(500).send({
          errors: {
            query: queryErrors,
            params: paramsErrors,
            body: bodyErrors,
          },
        });
        return;
      }
      next();
    } catch (error) {
      res.status(500).send({ error: 'Something Went Wrong' });
    }
  };
};
