import { Request, Response, Application } from 'express';
import { archiveRoutes } from '@archive/routes/archiveRoutes';
import { config } from '@configs/configEnv';

export default (app: Application) => {
  const routes = () => {
    app.use('/healtcheck', (_req: Request, res: Response) => res.send('Server is OK'));

    app.use(config.BASE_PATH!, archiveRoutes.routes());
  };

  routes();
};
