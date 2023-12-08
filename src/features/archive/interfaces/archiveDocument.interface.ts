import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IArchiveDocument extends Document {
  _id: string | ObjectId;
  title: string;
  document: string;
  fileType: string;
  public_cloudinary_id: string;
  resource_type: string;
  type_cloudinary: string;
  createdAt: Date;
}
