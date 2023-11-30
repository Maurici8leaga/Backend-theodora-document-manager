// los controladores son donde va la logica de negocios
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
  // asi se usa el decorador de joi
  @joiValidationBody(archiveBodySchema) // joiValidation es para validar los parametros del request en el body
  @joiValidationFile(archiveFileSchema) // joiValidation es para validar los parametros del request en el file

  // controller to create a file
  public async createFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    if (!req.file) {
      // debe ir un validador de req.file antes de ser usado ya que puede ser undefined
      throw new BadRequestError('Error uploading the file. Try again.');
    }

    const { originalname, buffer, mimetype } = req.file;
    // OJO en el req.body solo llega "title"  y el "documento" llega por req.file, por eso se hace esto

    const fileBase64: string = Generators.convertToBase64(buffer);
    // se debe convertir buffer que viene siendo el file encryptado en base64 ya que se requiere para poder enviarlo en la ruta
    // a cloudinary

    const uniqueName: string = `${Generators.randomIdGenerator()}_${originalname}`;

    // upload file to cloudinary
    const cloduinaryObj: UploadApiResponse = (await uploads(
      `data:${mimetype};base64,${fileBase64}`,
      `${uniqueName}` // para archivos como txt,pdf, etc se debe pasar el nombre original con su extension porque asi lo pide cloudinary
      // OJO IMPORTANTE PARA SUBIR FILES COMO TXT,PDF etc. DEBE IR ESTA RUTA "data:mimeType;base64,[base64...]" YA QUE SIN ESTO
      // EL ARCHIVO NO SE VA A PODER SUBIR CORRECTAMENTE, PASANDO SOLO EL BASE64 NO LO VA A PODER GUARDAR
    )) as UploadApiResponse;
    // se crea una variable de tipo "UploadApiResponse" el cual es una interfaz de cloudinary
    // se usa await ya que "uploads" devuelve un promise, esta funcion se le pasa 2 parametros,
    // 1ro importante es el file que sera el archivo, 2do es un id ya que cada imagen debe tener un id identificador

    if (!cloduinaryObj?.public_id) {
      // METODO DE VERIFICIACION IMPORTANTE de no haber un "userObjectId" mostrara un error, se coloca esto porque de ser cloduinaryObj undefined dara errorr
      // y esto soluciona dicha condicion
      throw new BadRequestError('Error uploading the file to cloudinary. Try again.');
    }

    // se crea ID para el file
    const fileID: ObjectId = new ObjectId();

    // la data con la estructura del archivo
    const fileData: IArchiveDocument = Archive.prototype.archiveData({
      // se llama el metodo creado en el file "archive.utility"
      // IMPORTANTE se debe usar este metodo "Archive.prototype.archiveData" y no con el this, ya que cuando se agregue esto en la ruta el express no reconocera el metodo con el this
      // en cambio con prototype reconocera que es un metodo que existe de la clase abstracta ArchiveUtility

      _id: fileID,
      title,
      document: cloduinaryObj.url,
      fileType: mimetype,
      public_cloudinary_id: uniqueName,
      resource_type: cloduinaryObj.resource_type,
      type_cloudinary: cloduinaryObj.type
    });

    // request a la db para crear el archivo
    const fileCreated: IArchiveDocument = await archiveService.createFile(fileData);
    //  ojo se tipea tanto en entrada como en salidas de datos!!!

    if (!fileCreated) {
      throw new InternalServerError(
        'An internal error has occurred, please try again later or contact your administrator.'
      );
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'File created succesfully', file: fileCreated });
    //se le pasa un status de creado el cual es 201
  }

  // controller to get all files in the db
  public async getFiles(_req: Request, res: Response): Promise<void> {
    const files: IArchiveDocument = await archiveService.getAllFiles();

    // SOLUCIONAR ESTA CONDICION CUANDO FILES ES 0
    if (!files) {
      throw new NotFoundError('Error, there are not files yet');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', files });
    // files sera un array, como le voy a poner "files:files" lo puedo dejar como files
  }

  // controller to get file by Id
  public async getFileById(req: Request, res: Response): Promise<void> {
    const file: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!file) {
      throw new NotFoundError('Error, file not found');
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', file });
  }

  public async editFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    const verifyFile: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!verifyFile) {
      throw new NotFoundError('Error, file not found');
    }

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

  public async deleteFile(req: Request, res: Response): Promise<void> {
    const file: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!file) {
      throw new NotFoundError('Error, file not found');
    }

    // estas opciones en la practica son necesarias, aunque dicen ser opcionales
    const options: IOptionFile = {
      type: file.type_cloudinary,
      resource_type: file.resource_type
    };

    // delete file from cloudinary
    const deleteFromCloudinary: IDeleteResponse = (await deleteResource(
      [`${file.public_cloudinary_id}`],
      options
    )) as IDeleteResponse;
    // se coloca el public_id entre [] porque espera que sea un string[]

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
