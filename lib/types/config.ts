export interface ServerConfig {
  port: number;
  trustProxy: boolean;
  logLevel: string;
}

export interface AppConfig {
  server: ServerConfig;
}
