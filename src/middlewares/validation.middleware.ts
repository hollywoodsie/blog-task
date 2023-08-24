import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async (dto: new () => object, obj: object) => {
  const dtoObj = plainToInstance(dto, obj, { enableImplicitConversion: true });

  const errors = await validate(dtoObj);

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
  return async (
    req: Request<object, object, object, object>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log({ params: req.params, paramsDto });
      const [queryErrors, paramsErrors, bodyErrors] = await Promise.all([
        queryDto && validateDto(queryDto, req.query),
        paramsDto && validateDto(paramsDto, req.params),
        bodyDto && validateDto(bodyDto, req.body),
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
