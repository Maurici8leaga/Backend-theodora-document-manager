import cloudinary from 'cloudinary';
import { IOptionFile } from './fileOptions.interface';
import { IDeleteResponse } from './deleteResponse.interface';

// esta es una funcion especifica para eliminar archivos de cloudinary
// mas info : https://cloudinary.com/documentation/admin_api#delete_resources

export async function deleteResource(public_id: string[], options?: IOptionFile): Promise<IDeleteResponse | unknown> {
  // las options sera un objeto por eso se crea un interface para el precisamente
  return new Promise((resolve, reject) => {
    cloudinary.v2.api.delete_resources(public_id, options, (error: unknown, result: IDeleteResponse) => {
      // public_id es el nombre del file en cloudinary, las options pueden ser necesarias para eliminar el file
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}
