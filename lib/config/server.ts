import { registerAs } from '@nestjs/config';

import { ServerConfig } from '@lib/types/config';
import { env } from '@lib/utils/env';

export default registerAs(
  'server',
  (): ServerConfig => ({
    port: env('PORT', 'int'),
    trustProxy: env('SERVER_TRUST_PROXY', 'boolean', false),
    logLevel: env('SERVER_LOG_LEVEL', 'string', 'info'),
    shutdownTimeout: env('SERVER_SHUTDOWN_TIMEOUT', 'int', 5000),
    cors: {
      origin: env('SERVER_CORS_ORIGIN', 'string', '*'),
      methods: env('SERVER_CORS_METHODS', 'set', [
        'GET',
        'HEAD',
        'PUT',
        'PATCH',
        'POST',
        'DELETE',
        'OPTIONS',
      ]),
      credentials: env('SERVER_CORS_CREDENTIALS', 'boolean', true),
    },
  }),
);
