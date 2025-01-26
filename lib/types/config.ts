export interface ServerConfig {
  port: number;
  trustProxy: boolean;
  logLevel: string;
  shutdownTimeout: number;
}

export interface AppConfig {
  server: ServerConfig;
}
