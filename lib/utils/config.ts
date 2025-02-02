import * as fs from 'node:fs';
import * as path from 'node:path';

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

type ConfigFactory<T> = () => T;

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const readConfig = (configPath: string): string => {
  try {
    return fs.readFileSync(configPath, 'utf8');
  } catch {
    throw new ConfigError(`${configPath} file not found`);
  }
};

const expandEnvVars = (cfgJSON: string): string =>
  cfgJSON.replace(
    /\$\{(\w+)(?::-([^}]+))?}/g,
    (_, key: string, defaultValue: string | undefined) => {
      if (process.env[key] !== undefined) {
        return process.env[key];
      }
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ConfigError(`missing ${key} environment variable`);
    },
  );

export const loadConfig = <T extends object>(
  configPath: string,
  dto: ClassConstructor<T>,
): ConfigFactory<T> => {
  const cfgPath = path.isAbsolute(configPath)
    ? configPath
    : path.resolve(configPath);
  return () => {
    const cfgJSON = readConfig(cfgPath);
    const cfgExpanded = expandEnvVars(cfgJSON);
    const cfg = <object>JSON.parse(cfgExpanded);
    const instance = plainToInstance(dto, cfg, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });
    const errors = validateSync(instance, {
      whitelist: true,
      stopAtFirstError: true,
      skipMissingProperties: false,
    });
    if (errors.length > 0) throw new ConfigError(errors[0].toString());
    return instance;
  };
};
