export interface ServerConfig {
  port: number;
  trustProxy: boolean;
}

export interface AppConfig {
  server: ServerConfig;
}
