import rateLimit from 'express-rate-limit';
import { AppError } from '../errors/app-error';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, _res, next) {
    next(
      new AppError(
        'Too many requests from this IP, please try again after 15 minutes.',
        429,
        'TOO_MANY_REQUESTS'
      )
    );
  }
});

export const apiToolRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 heavy PDF operations per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req, _res, next) {
    next(
      new AppError(
        'Rate limit exceeded for PDF operations. Please slow down and try again shortly.',
        429,
        'PDF_RATE_LIMIT_EXCEEDED'
      )
    );
  }
});
