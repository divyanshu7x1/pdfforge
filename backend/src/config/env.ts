import { config } from 'dotenv';
import { z } from 'zod';

config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  APP_NAME: z.string().trim().min(1).default('pdfforge-backend'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  CORS_ORIGIN: z.string().trim().default('*'),
  REQUEST_BODY_LIMIT: z.string().trim().min(1).default('10mb'),
  PDF_UPLOAD_MAX_FILE_SIZE_BYTES: z.coerce.number().int().positive().default(100 * 1024 * 1024)
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  const issues = parsedEnvironment.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join(', ');

  throw new Error(`Invalid environment configuration: ${issues}`);
}

const rawEnvironment = parsedEnvironment.data;

const defaultAllowedOrigins = [
  'https://pdfforge-frontend-kappa.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000'
];

const parsedOrigins =
  rawEnvironment.CORS_ORIGIN === '*'
    ? ['*']
    : rawEnvironment.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter((origin): origin is string => origin.length > 0);

const corsOrigins = parsedOrigins.includes('*')
  ? ['*']
  : Array.from(new Set([...parsedOrigins, ...defaultAllowedOrigins]));

if (corsOrigins.length === 0) {
  throw new Error('Invalid environment configuration: CORS_ORIGIN must not be empty');
}

export const env = {
  ...rawEnvironment,
  corsOrigins,
  isDevelopment: rawEnvironment.NODE_ENV === 'development',
  isProduction: rawEnvironment.NODE_ENV === 'production'
} as const;
