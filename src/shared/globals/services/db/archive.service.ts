import { ArchiveSchema } from '@archive/models/archive.schema';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';

//aqui se implementa principio SOLID open / close y single  responsability, ya que las funcionales de esta clase pueden expanderse en variedad
class ArchiveService {
  // funcion asincrona para crear un video, es asincrona ya que los metodo de mongoose son asincronos
  public async createFile(data: IArchiveDocument): Promise<IArchiveDocument> {
    const createFile: IArchiveDocument = await ArchiveSchema.create(data); // el metodo "create" es de mongoose,  el permite crear un documento en la DB

    // OJO se coloca el type aca y se retorna un promis ede tipo IArchiveDocument porque a la hora de usar la funcion si no se coloca esto
    // devolvera undefined y no se quiere eso

    return createFile;
  }

  public async getFileById(fileId: string): Promise<IArchiveDocument> {
    const file: IArchiveDocument = (await ArchiveSchema.findById({ _id: fileId })) as IArchiveDocument;
    //OJO SE DEBE TIPAR ACA LA ESTRUCTURA DE LO QUE VA A DEVOLVER ESTO PARA QUE DONDE SEA IMPLEMENTADO NO TENGA QUE TIPARSE OBLIGATORIAMENTE
    // SE DEBE TIPAR SIEMPRE ENTRADAS Y SALIDAS DE FUNCIONES QUE DEVUELVAN DATOS

    return file; //EN ESTE CASO DEVUELVE UN ARCHIVO
  }

  public async getAllFiles(): Promise<IArchiveDocument> {
    const files: IArchiveDocument = (await ArchiveSchema.find()) as unknown as IArchiveDocument; // se pasa "as unknow" primero para asi poder decirle que devolvera un type IArchiveDocument y tendra todos parametros de esa interfaz
    //OJO SE DEBE TIPAR ACA LA ESTRUCTURA DE LO QUE VA A DEVOLVER ESTO PARA QUE DONDE SEA IMPLEMENTADO NO TENGA QUE TIPARSE OBLIGATORIAMENTE

    return files;
  }

  public async editFile(id: string, newTitle: string): Promise<IArchiveDocument> {
    const file: IArchiveDocument = (await ArchiveSchema.updateOne(
      { _id: id },
      { $set: { title: newTitle } }
    )) as unknown as IArchiveDocument;
    //OJO SE DEBE TIPAR ACA LA ESTRUCTURA DE LO QUE VA A DEVOLVER ESTO PARA QUE DONDE SEA IMPLEMENTADO NO TENGA QUE TIPARSE OBLIGATORIAMENTE
    //lo encontrara por el id del file
    //updateOne es un metodo de consulta de mongoose para actualizar un campo , el 1er argumento es el cual buscara, y el 2do argumento sera el que actualizara
    // el $set es un operador de mongo el cual sirve para actualizar el parametro seleccionado
    // el "updateOne" puede actualizar con y sin el operaador $set

    return file;
  }

  public async deleteFile(fileId: string): Promise<unknown> {
    // CAMBIAR EL TIPEO TAMBIENN EN EL CONTROLLER
    // public async deleteFile(fileId: string): Promise<void> {
    const res = await ArchiveSchema.deleteOne({ _id: fileId }); // se pasa el id del archivo para eliminarlo de la coleccion
    // deleteOne es un metodo de consulta de mongoose el cual sirve para eliminar 1 solo elemento de la coleccion

    return res;
  }
}

export const archiveService: ArchiveService = new ArchiveService();
