export interface ServerConfig {
  port: number;
  trustProxy: boolean;
  logLevel: string;
  shutdownTimeout: number;
  cors: {
    origin: string;
    methods: string[];
    credentials: boolean;
  };
  swagger: {
    enable: boolean;
    title: string;
    description: string;
    version: string;
    path: string;
  };
}

export interface AppConfig {
  server: ServerConfig;
}
