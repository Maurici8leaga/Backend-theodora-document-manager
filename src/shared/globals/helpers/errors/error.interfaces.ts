// DATO cuando se coloca la I primero seguido del nombre en una interfaz es para hacer saber que es de una interfaz

// se crea una interfaz para asi definir la estructura que tendra los metodos errors que la hereden
export interface IError {
  message: string;
  statusCode: number;
  status: string;
}