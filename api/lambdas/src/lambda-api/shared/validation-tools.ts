import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateOrReject, ValidatorOptions } from 'class-validator';
import { Request, Response } from 'lambda-api';

export const validateOrRejectRequest = async <T extends object>(
  req: Request,
  res: Response,
  DtoClass: ClassConstructor<T>,
  options?: ValidatorOptions,
): Promise<T | null> => {
  try {
    const dto = plainToInstance(DtoClass, req.body, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    });
    await validateOrReject(dto, {
      whitelist: true,
      ...options,
    });
    return dto;
  } catch (error) {
    res.status(400).json({
      message: 'Validation failed',
      errors: error,
    });
    return null;
  }
};
