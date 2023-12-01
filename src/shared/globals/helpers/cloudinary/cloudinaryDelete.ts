import cloudinary from 'cloudinary';
import { IOptionFile } from './fileOptions.interface';
import { IDeleteResponse } from './deleteResponse.interface';

// Function to delete resources from cloudinary
export async function deleteResource(public_id: string[], options?: IOptionFile): Promise<IDeleteResponse | unknown> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.api.delete_resources(public_id, options, (error: unknown, result: IDeleteResponse) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
