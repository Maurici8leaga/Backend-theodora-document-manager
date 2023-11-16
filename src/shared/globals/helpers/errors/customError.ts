import { IError } from './error.interfaces';

// se crea este abstrac class para definir una estructura de clases errores personalizados
// cada clase heredada de este class debera usar esta estructura

// aqui se implementa Design Pattern Facade: https://refactoring.guru/es/design-patterns/facade
//y tambien se implementa Desing pattern Singleton: https://refactoring.guru/es/design-patterns/singleton
export abstract class CustomError extends Error {
  // la clase Error es una clase del lenguaje para manejar los Errores
  // se crean los parametros abstractos los cuales seran obligatorios colocar en las otras clases

  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    // es necesario llamar "super" cuando es una clase heredada de otra clase padre
    super(message); // el constructor de la clase Error necesita "message" por ende es obligatorio enviarle atraves de super "message"
    // sin super las tareas de la clase no se realizaran
  }

  // se crea este metodo para que cuando sea llamado muestre este objeto con estos parametros
  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}
