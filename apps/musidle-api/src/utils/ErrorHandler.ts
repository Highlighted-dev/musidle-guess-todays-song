import { logger } from './Logger';

export function errorHandler(err: Error): void {
  logger.error(err);
}
export const isTrustedError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

export default class AppError extends Error {
  //@ts-ignore
  public readonly name: string;

  public readonly httpCode: number;

  public readonly isOperational: boolean;

  constructor(httpCode: number, description: string, isOperational = true) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
