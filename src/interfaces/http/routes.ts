import { Request, Response, Application } from 'express';
import { archiveRoutes } from '@archive/routes/archiveRoutes';
import { config } from '@configs/configEnv';

// funcion anonima que contendra las rutas princiapales a exposicion
export default (app: Application) => {
  // app:Application es para disponibilizar las rutas a express

  const routes = () => {
    //aqui se implementa (Patron Chain of Responsibility)

    // esta ruta es para solo verificar que el server este OK
    app.use('/healtcheck', (_req: Request, res: Response) => res.send('Server is OK'));

    // routes para los files
    app.use(config.BASE_PATH!, archiveRoutes.routes());
  };

  routes();
};
