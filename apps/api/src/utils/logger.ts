import winston from 'winston';

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack, correlationId, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (correlationId) {
    msg = `${timestamp} [${level}] [${correlationId}]: ${message}`;
  }
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json() // production defaults to JSON format
  ),
  defaultMeta: { service: 'mospi-api' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV !== 'production' 
        ? combine(colorize(), consoleFormat) 
        : undefined, // uses the JSON format in production
    }),
  ],
});
