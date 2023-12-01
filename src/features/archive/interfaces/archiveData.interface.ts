import { ObjectId } from 'mongodb';

export interface IArchiveData {
  _id: ObjectId;
  title: string;
  document: string;
  fileType: string;
  public_cloudinary_id: string;
  resource_type: string;
  type_cloudinary: string;
}
