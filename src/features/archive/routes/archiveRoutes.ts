import express, { Router } from 'express';
import { Archive } from '@archive/controllers/archive';
import multer from 'multer';

class ArchiveRoutes {
  private router: Router;
  private upload: multer.Multer;

  constructor() {
    this.router = express.Router();
    this.upload = multer({ storage: multer.memoryStorage() });
  }

  public routes(): Router {
    this.router.get('/', Archive.prototype.getFiles);

    this.router.get('/searchFile/:id', Archive.prototype.getFileById);

    this.router.post('/upload', this.upload.single('document'), Archive.prototype.createFile);

    this.router.put('/editFile/:id', Archive.prototype.editFile);

    this.router.delete('/deleteFile/:id', Archive.prototype.deleteFile);

    return this.router;
  }
}

export const archiveRoutes: ArchiveRoutes = new ArchiveRoutes();
