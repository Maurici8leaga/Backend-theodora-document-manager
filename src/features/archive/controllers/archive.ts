// los controladores son donde va la logica de negocios
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidationBody, joiValidationFile } from '@decorators/joiValidation.decorators';
import { archiveBodySchema, archiveFileSchema } from '@archive/scheme/archive';
import { IArchiveDocument } from '@archive/interfaces/archiveDocument.interface';
import { archiveService } from '@services/db/archive.service';
import { BadRequestError } from '@helpers/errors/badRequestError';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@helpers/cloudinary/cloudinaryUploads';
import { ArchiveUtility } from './utilities/archive.utility';
import HTTP_STATUS from 'http-status-codes';
import { Generators } from '@helpers/generators/generators';
import { config } from '@configs/configEnv';

export class Archive extends ArchiveUtility {
  // asi se usa el decorador de joi
  @joiValidationBody(archiveBodySchema) // joiValidation es para validar los parametros del request en el body
  @joiValidationFile(archiveFileSchema) // joiValidation es para validar los parametros del request en el file

  // controller to create a file
  public async createFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    if (!req.file) {
      // debe ir un validador de req.file antes de ser usado ya que puede ser undefined
      throw new BadRequestError('File upload: Error ocurred. Try again.');
    }

    const { originalname, buffer, mimetype } = req.file;
    // OJO en el req.body solo llega "title"  y el "documento" llega por req.file, por eso se hace esto

    const fileBase64 = Generators.convertToBase64(buffer);
    // se debe convertir buffer que viene siendo el file encryptado en base64 ya que se requiere para poder enviarlo en la ruta
    // a cloudinary

    const uniqueName = `${Generators.randomIdGenerator()}_${originalname}`;

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
      throw new BadRequestError('File upload: Error ocurred. Try again.');
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

    console.log(fileData, 'es');

    // request a la db para crear el archivo
    const fileCreated = (await archiveService.createFile(fileData)) as unknown as IArchiveDocument;
    //  ojo se tipea tanto en entrada como en salidas de datos!!!

    res.status(HTTP_STATUS.CREATED).json({ message: 'File created succesfully', file: fileCreated });
    //se le pasa un status de creado el cual es 201
  }

  // controller to get all files in the db
  public async getFiles(_req: Request, res: Response): Promise<void> {
    const files: IArchiveDocument = await archiveService.getAllFiles();

    if (!files) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'There are not files yet', files: [] });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', files });
    // files sera un array, como le voy a poner "files:files" lo puedo dejar como files
  }

  // controller to get file by Id
  public async getFileById(req: Request, res: Response): Promise<void> {
    const file: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!file) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'There are not files yet', files: '' });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Succesful request', file });
  }

  public async editFile(req: Request, res: Response): Promise<void> {
    const { title } = req.body;

    const verifyFile: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    if (!verifyFile) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'The file does not exist' });
    }

    const titleUppercase = Generators.firstLetterCapitalized(title);

    // updating the file with new title
    await archiveService.editFile(`${req.params.id}`, titleUppercase);

    // getting the updated file
    const fileUpdated: IArchiveDocument = await archiveService.getFileById(`${req.params.id}`);

    res.status(HTTP_STATUS.CREATED).json({ message: 'File updated successfully', file: fileUpdated });
  }
}
