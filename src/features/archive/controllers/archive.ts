// los controladores son donde va la logica de negocios
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@decorators/joiValidation.decorators';
import { archiveSchema } from '@archive/scheme/archive';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { archiveService } from '@services/db/archive.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@helpers/cloudinary/cloudinaryUploads';
import { ArchiveUtility } from './utilities/archive.utility';
import HTTP_STATUS from 'http-status-codes';
import { config } from '@configs/configEnv';

export class Archive extends ArchiveUtility {
  // asi se usa el decorador de joi
  @joiValidation(archiveSchema) // joiValidation es para validar los parametros del request
  public async createFile(req: Request, res: Response): Promise<void> {
    const { title, document, fileType } = req.body;

    const fileID: ObjectId = new ObjectId();
    const fileObjectID: ObjectId = new ObjectId(); //el file debe llevar un id unico el cual sera el nombre que llevara en cloudinary

    // upload file to cloudinary
    const result: UploadApiResponse = (await uploads(document, `${fileObjectID}`)) as UploadApiResponse;
    // se crea una variable de tipo "UploadApiResponse" el cual es una interfaz de cloudinary
    // se usa await ya que "uploads" devuelve un promise, esta funcion se le pasa 2 parametros,
    // 1ro importante es el file que sera el archivo, 2do es un id ya que cada imagen debe tener un id identificador

    if (!result?.public_id) {
      // de no haber un "userObjectId" mostrara un error
      throw new BadRequestError('File upload: Error ocurred. Try again.');
    }

    // file url in cloudinary
    const cloudinaryDocument = `${config.CLOUD_DOMAIN}/${config.CLOUD_NAME}/raw/upload/v${result.version}/${fileObjectID}`;

    // la data con la estructura del archivo
    const fileData: IArchiveDocument = Archive.prototype.archiveData({
      // se llama el metodo creado en el file "archive.utility"
      // IMPORTANTE se debe usar este metodo "Archive.prototype.archiveData" y no con el this, ya que cuando se agregue esto en la ruta el express no reconocera el metodo con el this
      // en cambio con prototype reconocera que es un metodo que existe de la clase abstracta ArchiveUtility

      _id: fileID,
      title,
      document: cloudinaryDocument,
      fileType
    });

    // request a la db para crear el archivo
    const fileCreated = (await archiveService.createFile(fileData)) as unknown as IArchiveDocument;

    res.status(HTTP_STATUS.CREATED).json({ message: 'File created succesfully', file: fileCreated });
    //se le pasa un status de creado el cual es 201
  }
}
