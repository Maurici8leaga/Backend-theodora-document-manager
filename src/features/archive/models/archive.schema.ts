import { model, Model, Schema } from 'mongoose';
// model: es una funcion que resuelve la creacion de shcema del modules
// Model: es una interfaz
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';

// se crea una instancia de Schema de mongoose para los archivos
const archiveSchema: Schema = new Schema({
  // aqui se definen los argumentos IMPORTANTES con su type
  // DATO YA QUE ESTA EN TYPESCRIPT NO SE COLOCA EL PARAMETRO REQUIRED PORQUE ESTA DEFINIDO EN LA INTERFAZ IVideoDocument

  title: { type: String, default: '' },
  document: { type: String, default: '' },
  fileType: { type: String, default: '' }
});

// ArchiveSchema sera el nombre de este Schema el cual sera de tipo IVideoDocument
const ArchiveSchema: Model<IArchiveDocument> = model<IArchiveDocument>('Archive', archiveSchema, 'Archive');
// el 1er parametro es el nombre de referencia que tendra en la colleccion de mongoose
// 2do parametro es el Schema
// 3er parametro en model<>() es para la referencia de como quiere ser llamado cuando sea implementado en otro schema, este es opcional ya que se usa solo cuando se va hacer referencia de ese schema en otros schemas
export { ArchiveSchema }; // se conectan con las otras collecciones implicitamente atraves de mongo
