// Este file es para manejar de una forma organizadas las variables de entorno de la app BUENA PRACTICA
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({});
// el metodo "config" de dotenv permite poder llamar las variables globales que se tengan en .el archivo .env y asi poder usarlas

class Config {
  // aqui iran toda las variables que existan en el file .env
  public NODE_ENV: string | undefined;
  // creamos las propiedad publicas porque queremos poder acceder a ellas en otros lugares
  public CLIENT_URL: string | undefined;
  public SERVER_PORT: string | undefined;
  public DATABASE_URL: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public CLOUD_DOMAIN: string | undefined;
  public BASE_PATH: string | undefined;

  // inicializando las variables
  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    // "process.env" es la que permite poder apuntar a esta variable
    this.CLIENT_URL = process.env.CLIENT_URL;
    // de esta forma podemos poner dinamicamente el valor del puerto segun su entorno
    this.SERVER_PORT = process.env.NODE_ENV === 'development' ? '5001' : '80';
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.CLOUD_NAME = process.env.CLOUD_NAME;
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
    this.CLOUD_DOMAIN = process.env.CLOUD_DOMAIN;
    this.BASE_PATH = process.env.BASE_PATH;
  }

  // se crea un metodo publico para validar que estas variables de entorno no esten vacias
  // es  un metodo util de verificacion
  public validateConfigEnv(): void {
    //se coloca void porque esta funcion no devolvera  nada
    console.log(this); // esto va a retornar un arrays de stings con su key y valor
    for (const [key, value] of Object.entries(this)) {
      // "key" para los nombres de las variables, "value" el valor que contienen
      if (value === undefined) {
        // se active un error por si la variable esta vacia
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }

  // se crea un metodo publico para las configuraciones de cloudinary
  public cloudinaryConfig(): void {
    cloudinary.config({
      // el metodo config es de la version 2  de cloudinary necesita que se le pase  las credenciales, las cuales estan en las variables de entorno
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

//se crea la instancia de la clase
export const config: Config = new Config();
