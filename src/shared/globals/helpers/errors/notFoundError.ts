// HTTP_STATUS tiene todos los status de errores del servidor
import HTTP_STATUS from 'http-status-codes';
import { CustomError } from './customError';

// se crea una clase heredada de la class abstracta CustomError para crear este error para solo esta ocasion
export class NotFoundError extends CustomError {
  // se crea este class para errores los archivos que no sean encontrados

  // "NOT_FOUND" es el status code "404" que tendra este error estos son nombres de referecia que los acompañan
  // mas info: https://www.semrush.com/blog/http-status-codes/?kw&cmp=LM_SRCH_DSA_Blog_EN&label=dsa_pagefeed&Network=g&Device=c&utm_content=622526966302&kwid=dsa-1754723155433&cmpid=18364824154&agpid=146618527572&BU=Core&extid=60109657981&adpos
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';

  // se coloca en el constructor el parametro message para que se coloque el tipo de mensaje que se quiera mostrar
  // cuado sea implementado
  constructor(message: string) {
    super(message);
  }
}
