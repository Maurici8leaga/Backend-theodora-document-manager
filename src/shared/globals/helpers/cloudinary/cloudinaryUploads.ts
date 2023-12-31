import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Ifile } from './fileResult.interface';

// Function for upload resource to cloudinaryy
export function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined | Ifile> {
  return new Promise(resolve => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: 'auto',
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          resolve(error);
        }
        resolve(result);
      }
    );
  });
}
