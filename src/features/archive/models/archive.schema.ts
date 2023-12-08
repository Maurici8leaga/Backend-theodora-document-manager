import { model, Model, Schema } from 'mongoose';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';

const archiveSchema: Schema = new Schema({
  title: { type: String, default: '' },
  document: { type: String, default: '' },
  fileType: { type: String, default: '' },
  public_cloudinary_id: { type: String, default: '' },
  resource_type: { type: String, default: '' },
  type_cloudinary: { type: String, default: '' },
  createAt: { type: Date, default: Date.now() }
});

const ArchiveSchema: Model<IArchiveDocument> = model<IArchiveDocument>('Archive', archiveSchema, 'Archive');

export { ArchiveSchema };
