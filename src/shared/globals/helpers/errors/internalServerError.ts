import HTTP_STATUS from 'http-status-codes';
import { CustomError } from './customError';

// Class for internal server errors
export class InternalServerError extends CustomError {
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
