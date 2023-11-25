import express, { Router } from 'express';
import { Archive } from '@archive/controllers/archive';
import multer from 'multer';

class ArchiveRoutes {
  private router: Router;
  private upload: multer.Multer; //se coloca el type de multer el cual es este

  constructor() {
    this.router = express.Router();
    this.upload = multer({ storage: multer.memoryStorage() }); // ya que se necesita multer para subir archivo se debe inicializar
    // en el constructor de esta forma,  el "Storage" se coloca "memoryStorage" el cual es una memoria caache temporal
  }

  public routes(): Router {
    // endpoint para optener todos los files de la db
    this.router.get('/', Archive.prototype.getFiles);

    // endpoint para buscar file por id
    this.router.get('/searchFile/:id', Archive.prototype.getFileById);

    // endpoint para crear un file
    this.router.post('/upload', this.upload.single('document'), Archive.prototype.createFile);
    // para subir un archivo con multer se debe colocar como middleware, "single()" y adentro como va ser referenciado ese documento
    // OJO ESTO ES PARA CASO DE SOLO SUBIR 1 ARCHIVO

    // endpoint para editar un file
    this.router.put('/editFile/:id', Archive.prototype.editFile);

    // endpoint para eliminar un file
    this.router.delete('/deleteFile/:id', Archive.prototype.deleteFile);

    return this.router;
  }
}

export const archiveRoutes: ArchiveRoutes = new ArchiveRoutes();
