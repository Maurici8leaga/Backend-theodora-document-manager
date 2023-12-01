import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { IArchiveData } from '@archive/interfaces/archiveData.interface';
import { Generators } from '@helpers/generators/generators';

export abstract class ArchiveUtility {
  protected archiveData(data: IArchiveData): IArchiveDocument {
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
  }
}
