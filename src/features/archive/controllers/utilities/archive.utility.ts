import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { IArchiveData } from '@archive/interfaces/archiveData.interface';
import { Generators } from '@helpers/generators/generators';

// se crea una clase abstracta para hacer una abstracccion de los metodos a implementar en archive.ts del controller
export abstract class ArchiveUtility {
  protected archiveData(data: IArchiveData): IArchiveDocument {
    // "IArchiveData" ES EL CONTRATO que debe cumplir cuando se cree un documento
    const { _id, title, document, fileType, public_cloudinary_id, resource_type, type_cloudinary } = data;

    return {
      _id,
      title: Generators.firstLetterCapitalized(title),
      document,
      fileType,
      public_cloudinary_id,
      resource_type,
      type_cloudinary,
      createdAt: new Date()
    } as unknown as IArchiveDocument;
    // se pasa el pasa "IArchiveDocument" ya que la estructura espera que se cumpla el formato de la interfaz
  }
}
