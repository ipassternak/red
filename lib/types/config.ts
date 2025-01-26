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
}

export interface AppConfig {
  server: ServerConfig;
}
