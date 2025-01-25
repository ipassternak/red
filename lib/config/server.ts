import { registerAs } from '@nestjs/config';

import { ServerConfig } from '@lib/types/config';
import { env } from '@lib/utils/env';

export default registerAs(
  'server',
  (): ServerConfig => ({
    port: env('PORT', 'int'),
    trustProxy: env('SERVER_TRUST_PROXY', 'boolean', false),
  }),
);
