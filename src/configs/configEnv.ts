import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SERVER_PORT: string | undefined;
  public DATABASE_URL: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public CLOUD_DOMAIN: string | undefined;
  public BASE_PATH: string | undefined;
  public MONGO_URI: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.SERVER_PORT = process.env.NODE_ENV === 'development' ? '5001' : '80';
    this.DATABASE_URL = process.env.MONGO_URI || process.env.DATABASE_URL;
    this.CLOUD_NAME = process.env.CLOUD_NAME;
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
    this.CLOUD_DOMAIN = process.env.CLOUD_DOMAIN;
    this.BASE_PATH = process.env.BASE_PATH;
  }

  // Method for env validation
  public validateConfigEnv(): void {
    console.log(this);
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }

  // Method for running cloudinary
  public cloudinaryConfig(): void {
    cloudinary.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
