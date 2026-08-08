import type { CorsOptions } from 'cors';

import { AppError } from '../core/errors/app-error';
import { env } from './env';

const allowAllOrigins = env.corsOrigins.includes('*');

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowAllOrigins || env.corsOrigins.includes(origin)) {
      callback(null, origin);
      return;
    }

    callback(new AppError(`CORS origin '${origin}' is not allowed by policy.`, 403, 'CORS_NOT_ALLOWED'));
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length'],
  optionsSuccessStatus: 204
};
