import { ArchiveSchema } from '@archive/models/archive.schema';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { IDeleteArchive } from '@archive/interfaces/deleteArchive.interface';

class ArchiveService {
  // Method for create a file
  public async createFile(data: IArchiveDocument): Promise<IArchiveDocument> {
    const createFile: IArchiveDocument = (await ArchiveSchema.create(data)) as IArchiveDocument;
    return createFile;
  }

  // Method for search a file by id
  public async getFileById(fileId: string): Promise<IArchiveDocument> {
    const file: IArchiveDocument = (await ArchiveSchema.findById({ _id: fileId })) as IArchiveDocument;
    return file;
  }

  // Method for search all files from DB
  public async getAllFiles(): Promise<IArchiveDocument> {
    const files: IArchiveDocument = (await ArchiveSchema.find()) as unknown as IArchiveDocument;
    return files;
  }

  // Method for edit a file
  public async editFile(id: string, newTitle: string): Promise<IArchiveDocument> {
    const file: IArchiveDocument = (await ArchiveSchema.updateOne(
      { _id: id },
      { $set: { title: newTitle } }
    )) as unknown as IArchiveDocument;

    return file;
  }

  // Method for delete a file
  public async deleteFile(fileId: string): Promise<IDeleteArchive> {
    const res: IDeleteArchive = (await ArchiveSchema.deleteOne({ _id: fileId })) as IDeleteArchive;
    return res;
  }
}

export const archiveService: ArchiveService = new ArchiveService();
