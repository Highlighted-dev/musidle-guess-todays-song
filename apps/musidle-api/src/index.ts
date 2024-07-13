import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import { app } from './app';
import { logger } from './utils/Logger';
import { errorHandler, isTrustedError } from './utils/ErrorHandler';
import setupSocket from './utils/SocketHandlers';
import { getCurrentUrl } from './utils/GetCurrentUrl';
import { ICustomRequest } from './@types';
import { NextFunction } from 'express';

dotenv.config();

const port = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return process.env.PROD || 5000;
    case 'development':
      return 5000;
    default:
      return 0;
  }
};

const mongodbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URL_PROD || 'musidle'
    : process.env.MONGODB_URL || 'musidle';

export const server =
  process.env.NODE_ENV === 'production'
    ? https.createServer(
        {
          key: process.env.SERVER_KEY,
          ca: process.env.INTERMIDIATE_CA,
          cert: process.env.SERVER_CERT,
          keepAlive: true,
        },
        app,
      )
    : http.createServer(app);

const io = setupSocket(server); // Setup the socket server

const socketMiddleware = (req: ICustomRequest, res: Response, next: NextFunction) => {
  req.io = io;
  return next;
};

server.on('request', socketMiddleware);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongodbUrl).then(() => {
      server.listen(port(), () => {
        logger.info(
          `Musidle API is listening on ${getCurrentUrl()} in ${process.env.NODE_ENV} mode.`,
        );
        console.log(
          `Musidle API is listening on ${getCurrentUrl()} in ${process.env.NODE_ENV} mode.`,
        );
      });
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

connectToDatabase();

const exitHandler = (): void => {
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
};

const unexpectedErrorHandler = (error: Error): void => {
  errorHandler(error);
  if (!isTrustedError(error)) {
    exitHandler();
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
