import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import Logger from 'bunyan';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import { logger } from '@configs/configLogs';
import { config } from '@configs/configEnv';
import { CustomError } from '@helpers/errors/customError';
import { IErrorResponse } from '@helpers/errors/errorResponse.interface';
import applicationRoutes from '@interfaces/http/routes';

// variable for logs
const log: Logger = logger.createLogger('Server');

export class TheodoraDocumentManagerServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  // method for running server, middlewares and routes all once
  public start(): void {
    this.securityMiddleware(this.app);
    this.standarmiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  // method for security middlewares
  private securityMiddleware(app: Application): void {
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      })
    );
  }

  private standarmiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  // method for expose routes
  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  // method for global erros
  private globalErrorHandler(app: Application): void {
    // Answers for routes that do not exist in the server
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `The route ${req.originalUrl} was not found` });
    });

    // Answers for routes that exist in the server
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  // method for run node server
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    const PORT = Number(config.SERVER_PORT);

    httpServer.listen(PORT, () => {
      log.info(`Server started with pid process ${process.pid}`);

      log.info(`Server is running at Port ${PORT}`);
    });
  }
}
