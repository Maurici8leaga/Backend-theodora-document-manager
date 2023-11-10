// Aqui va todo lo referente a las configuracion del server y de la inicializacion del mismo
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import Logger from 'bunyan';
import hpp from 'hpp';
// para seguridad de ataques a las rutas xss
import helmet from 'helmet';
// para seguridad al server cuando la data navega por internet
import cors from 'cors';
// "cors" para comunicacion de dominios
import { config } from '@configs/configEnv';
import { logger } from '@configs/configLogs';

//creamos el logger para los logs de este class
const log: Logger = logger.createLogger('Server');
// "Server" es el nombre de referencia que se le dara a los logs que provengan de este class

export class TheodoraDocumentManagerServer {
  private app: Application;

  //se inicializa la propiedad
  constructor(app: Application) {
    this.app = app;
  }

  // se crea un metodo publico para que se ejecute cuando sea invocado start
  public start(): void {
    // al arrancar seran ejecutados estos metodos privados que manejan los middleware
    // aqui se aplica el patron chains of responsability
    this.securityMiddleware(this.app);
    this.startServer(this.app);
  }

  // metodo privado para los middlewares de seguridad
  private securityMiddleware(app: Application): void {
    app.use(hpp()); //middleware para proteger las rutas
    app.use(helmet()); //middleware para proteger la info cuando va desde y hacia el server
    app.use(
      cors({
        origin: config.CLIENT_URL, // se coloca la direccion URL de origen del cliente, o * si se quiere dejar abierta
        credentials: true, // config obligatoria,  para producción para credentials en ambientes cloud
        optionsSuccessStatus: 200, //codigo de respuesta de solicitud http
        methods: ['GET', 'POST', 'PUT', 'DELETE'] // metodos explicitos que se van a utilizar
      })
    );
  }

  // metodo de arranque asincrono del servidor de node
  private async startServer(app: Application): Promise<void> {
    try {
      //se crea una instancia de http.Server
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer); //se iniciliza el metodo para el arranque del servidor http
    } catch (error) {
      log.error(error); // los logger de tipo "error" son para mostrar errores , alertas, warning
    }
  }

  // metodo privado para arranque del servidor http
  private startHttpServer(httpServer: http.Server): void {
    const PORT = Number(config.SERVER_PORT);
    // se usa Number para convertir el valor de la variable "SERVER_PORT" en numero ya que process.env acepta solo strings

    // "http.Serve" es una clase de node js que permite crear un servidor http
    httpServer.listen(PORT, () => {
      // el metodo listen necesita 2 parametros, el 1ro es el numero de puerto en el que va a trabajar el servidor y el
      // 2do es un callback el cual puede mostrar algo

      log.info(`Server started with pid process ${process.pid}`); // se usa logger en vez de consol.log para asi tener mejor trazabilidad
      // se debe mandar un mensaje al terminal para indicar que el server esta OK

      log.info(`Server is running at Port ${PORT}`);
    });
  }
}
