import { Request } from 'express';
import { ObjectSchema } from 'joi';
import { JoiRequestValidationError } from '@helpers/errors/joiValidateError';

type TJoiDecorator = (target: unknown, key: string, descriptor: PropertyDescriptor) => void;

// Function for validate only the body of request
export function joiValidationBody(schema: ObjectSchema): TJoiDecorator {
  return (_target: unknown, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [Request]) {
      const req: Request = args[0];

      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Function for validate only the file of request
export function joiValidationFile(schema: ObjectSchema): TJoiDecorator {
  return (_target: unknown, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [Request]) {
      const req: Request = args[0];

      const fileValidation = await Promise.resolve(schema.validate(req.file));

      const fileError = fileValidation.error;

      if (fileError?.details) {
        throw new JoiRequestValidationError(fileError.details[0].message);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
