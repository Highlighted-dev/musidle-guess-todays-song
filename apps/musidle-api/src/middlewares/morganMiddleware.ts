import morgan from 'morgan';
import { logger } from '../utils/Logger';

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  },
);
