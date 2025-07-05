import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${typeof message === 'string' ? message : JSON.stringify(message)}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});
