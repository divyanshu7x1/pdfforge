import type { CorsOptions } from 'cors';

import { AppError } from '../core/errors/app-error';
import { env } from './env';

const allowAllOrigins = env.corsOrigins.includes('*');

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (allowAllOrigins || !origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new AppError(`CORS origin "${origin}" is not allowed`, 403, 'CORS_FORBIDDEN')
    );
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length'],
  optionsSuccessStatus: 204
};
