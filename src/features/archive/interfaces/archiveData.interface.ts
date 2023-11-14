import { ObjectId } from 'mongodb';

// (SOLID Interface Segregation)
export interface IArchiveData {
  _id: ObjectId;
  title: string;
  document: string;
  fileType: string;
}
