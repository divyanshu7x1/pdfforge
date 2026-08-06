import type { CorsOptions } from 'cors';

import { AppError } from '../core/errors/app-error';
import { env } from './env';

const allowAllOrigins = env.corsOrigins.includes('*');

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (allowAllOrigins) {
      callback(null, origin || true);
      return;
    }

    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, origin || true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length'],
  optionsSuccessStatus: 204
};
