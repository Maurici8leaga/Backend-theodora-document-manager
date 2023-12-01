import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidationBody, joiValidationFile } from '@decorators/joiValidation.decorators';
import { archiveBodySchema, archiveFileSchema } from '@archive/scheme/archive';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { archiveService } from '@services/db/archive.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { NotFoundError } from '@helpers/errors/notFoundError';
import { InternalServerError } from '@helpers/errors/internalServerError';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@helpers/cloudinary/cloudinaryUploads';
import { deleteResource } from '@helpers/cloudinary/cloudinaryDelete'; //OJO
import { ArchiveUtility } from './utilities/archive.utility';
import HTTP_STATUS from 'http-status-codes';
import { Generators } from '@helpers/generators/generators';
import { IOptionFile } from '@helpers/cloudinary/fileOptions.interface';
import { IDeleteResponse } from '@helpers/cloudinary/deleteResponse.interface';
import { IDeleteArchive } from '@archive/interfaces/deleteArchive.interface';

export class Archive extends ArchiveUtility {
  // validation schema with joi
  @joiValidationBody(archiveBodySchema)
  @joiValidationFile(archiveFileSchema)

  // Method for create a file
  public async createFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    if (!req.file) {
      throw new BadRequestError('Error uploading the file. Try again.');
    }

    const { originalname, buffer, mimetype } = req.file;

    // Transform buffer to base64
    const fileBase64: string = Generators.convertToBase64(buffer);

    // Give it a unique name
    const uniqueName: string = `${Generators.randomIdGenerator()}_${originalname}`;

    // upload file to cloudinary
    const cloduinaryObj: UploadApiResponse = (await uploads(
      `data:${mimetype};base64,${fileBase64}`,
      `${uniqueName}`
    )) as UploadApiResponse;

    if (!cloduinaryObj?.public_id) {
      throw new BadRequestError('Error uploading the file to cloudinary. Try again.');
    }

    // Give it an id to file
    const fileID: ObjectId = new ObjectId();

    const fileData: IArchiveDocument = Archive.prototype.archiveData({
      _id: fileID,
      title,
      document: cloduinaryObj.url,
      fileType: mimetype,
      public_cloudinary_id: uniqueName,
      resource_type: cloduinaryObj.resource_type,
      type_cloudinary: cloduinaryObj.type
    });

    // creating the file
    const fileCreated: IArchiveDocument = await archiveService.createFile(fileData);

    if (!fileCreated) {
      throw new InternalServerError(
        'An internal error has occurred, please try again later or contact your administrator.'
      );
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'File created succesfully', file: fileCreated });
  }

  // Method for get files from DB
  public async getFiles(_req: Request, res: Response): Promise<void> {
    // request to get the files
    const files: IArchiveDocument = await archiveService.getAllFiles();

    if (!files) {
      throw new NotFoundError('Error, there are not files yet');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', files });
  }

  // MEthod for get file by Id from DB
  public async getFileById(req: Request, res: Response): Promise<void> {
    // request to get the file
    const file: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!file) {
      throw new NotFoundError('Error, file not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', file });
  }

  // MEthod for edit a file
  public async editFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    // request to verify a file existence
    const verifyFile: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!verifyFile) {
      throw new NotFoundError('Error, file not found');
    }

    // Transform the title to uppercase
    const titleUppercase: string = Generators.firstLetterCapitalized(title);

    // updating the file with new title
    const update: IArchiveDocument = await archiveService.editFile(`${req.params.id}`, titleUppercase);

    // getting the updated file
    const fileUpdated: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!update || !fileUpdated) {
      throw new InternalServerError(
        'An internal error has occurred, please try again later or contact your administrator.'
      );
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'File updated successfully', file: fileUpdated });
  }

  // Method for delete a file
  public async deleteFile(req: Request, res: Response): Promise<void> {
    // request to get the file from DB
    const file: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!file) {
      throw new NotFoundError('Error, file not found');
    }

    // cloudinary options to search a file in the cloudinary db
    const options: IOptionFile = {
      type: file.type_cloudinary,
      resource_type: file.resource_type
    };

    // delete file from cloudinary
    const deleteFromCloudinary: IDeleteResponse = (await deleteResource(
      [`${file.public_cloudinary_id}`],
      options
    )) as IDeleteResponse;

    // If this const is the file was not found in cloudinary
    const cloudinaryFileNotFound: string = Object.values(deleteFromCloudinary.deleted)[0];

    if (cloudinaryFileNotFound == 'not_found') {
      throw new NotFoundError('Error, cloudinary file not found');
    }

    // delete file from db
    const deleteFromDB: IDeleteArchive = await archiveService.deleteFile(`${file._id}`);

    if (!deleteFromDB || !deleteFromCloudinary) {
      throw new InternalServerError(
        'An internal error has occurred, please try again later or contact the administrator.'
      );
    }

    res.status(HTTP_STATUS.OK).json({ message: 'File deleted successfully' });
  }
}
