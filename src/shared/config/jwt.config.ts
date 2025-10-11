import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

import { envKeys } from '@/shared/constants';

export function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: configService.getOrThrow<string>(envKeys.jwtSecret),
    signOptions: {
      algorithm: 'HS256',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}
