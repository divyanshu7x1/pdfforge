import type { ErrorRequestHandler } from 'express';

import { env } from '../../config/env';
import { AppError } from '../errors/app-error';

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const isAppErr = AppError.isAppError(error);
  const statusCode = isAppErr ? error.statusCode : 500;
  const code = isAppErr ? error.code : 'INTERNAL_SERVER_ERROR';
  const message =
    statusCode >= 500 && env.isProduction
      ? 'Internal Server Error'
      : isAppErr
        ? error.message
        : 'Internal Server Error';
  const details = isAppErr ? error.details : undefined;
  const stack = error instanceof Error ? error.stack : undefined;

  if (statusCode >= 500) {
    req.log.error({ err: error, code, path: req.originalUrl }, 'Request failed');
  } else {
    req.log.warn({ err: error, code, path: req.originalUrl }, 'Request failed');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      ...(!env.isProduction && stack ? { stack } : {})
    }
  });
};
