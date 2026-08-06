import compression from 'compression';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { corsOptions } from './config/cors';
import { env } from './config/env';
import { globalRateLimiter } from './core/middleware/rate-limiter.middleware';
import { errorHandler } from './core/middleware/error-handler';
import { notFoundHandler } from './core/middleware/not-found-handler';
import { requestLogger } from './core/middleware/request-logger';
import { healthRouter } from './modules/health/health.route';
import { apiRouter } from './routes';

export const app: Express = express();

app.disable('x-powered-by');

app.use(requestLogger);
app.use(globalRateLimiter);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: env.REQUEST_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.REQUEST_BODY_LIMIT }));
app.use(compression());

app.use('/health', healthRouter);
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
