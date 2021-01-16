require('dotenv').config();
const winston = require('winston');

// Create date object for log timestamp
const newDate = new Date();

/* Log levels, from highest to lowest:
 * 0. Error
 * 1. Warn
 * 2. Info
 * 3. HTTP
 * 4. Verbose
 * 5. Debug
 * 6. Silly
 */

// Setup general logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    timeStamp: `${newDate.toLocaleString()} ${newDate.getMilliseconds()}`,
    env: process.env.NODE_ENV,
  },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' }),

    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ dirname: 'logs', filename: 'combined.log' }),
  ],
});

// Setup console logger when not in production, with format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
