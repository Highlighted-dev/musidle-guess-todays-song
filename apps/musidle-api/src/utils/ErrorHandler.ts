import { NextFunction, Request, Response } from 'express';
interface ICustomError extends Error {
  type?: string;
  status?: number;
  code?: number;
}

const errorHandler = (error: ICustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  if (error.type === 'redirect') {
    return res.redirect('/error');
  }

  if (error.type === 'time-out') {
    return res.status(408).send(error);
  }

  return res.status(status).send({ status: 'error', error_code: error.code, message: message });
};

export default errorHandler;
