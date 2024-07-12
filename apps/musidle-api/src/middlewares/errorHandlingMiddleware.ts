import { Request, Response, NextFunction } from 'express';

import AppError, { errorHandler, isTrustedError } from '../utils/ErrorHandler';

export const errorHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  errorHandler(error);
  const isTrusted = isTrustedError(error);
  const httpStatusCode = isTrusted ? (error as AppError).httpCode : '500';
  const responseError = isTrusted ? error.message : 'Internal Server Error';
  res.status(Number(httpStatusCode)).json({ error: responseError });
};
