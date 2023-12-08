import bunyan from 'bunyan';

class LoggerConfig {
  // method for create logs
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'info' });
  }
}

export const logger: LoggerConfig = new LoggerConfig();
