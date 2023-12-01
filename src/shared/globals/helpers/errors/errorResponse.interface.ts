import { IError } from './error.interfaces';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;

  serializeErrors(): IError;
}
