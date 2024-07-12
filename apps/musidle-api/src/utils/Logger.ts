import winston from 'winston';

const { combine, timestamp, json } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: './app.log',
    }),
    new winston.transports.File({
      filename: './error.log',
      level: 'error',
    }),
  ],
});
