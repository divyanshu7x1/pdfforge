export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details?: unknown
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;

    if (details !== undefined) {
      this.details = details;
    }

    Error.captureStackTrace(this, this.constructor);
  }

  public static isAppError(error: unknown): error is AppError {
    if (error instanceof AppError) {
      return true;
    }

    if (error instanceof Error && 'statusCode' in error && 'code' in error) {
      const errObj = error as unknown as { statusCode?: unknown; code?: unknown };
      return typeof errObj.statusCode === 'number' && typeof errObj.code === 'string';
    }

    return false;
  }
}
