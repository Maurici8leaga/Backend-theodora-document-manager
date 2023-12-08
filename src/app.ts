import express, { Express } from 'express';
import { TheodoraDocumentManagerServer } from '@bootstrap/setupServer.bootstrap';
import databaseConnection from '@bootstrap/setupDatabase.bootstrap';
import { config } from '@configs/configEnv';

class Application {
  // Method for initialize server
  public initialize(): void {
    this.loadConfig();
    databaseConnection();

    const app: Express = express();
    const server: TheodoraDocumentManagerServer = new TheodoraDocumentManagerServer(app);

    server.start();
  }

  // Method for run env validations and cloudinary
  private loadConfig(): void {
    config.validateConfigEnv();
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.initialize();
