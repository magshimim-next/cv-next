/* eslint-disable no-console */
import "server-only";
import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
});

const formatMeta = (meta: any) => {
  const splat = meta[Symbol.for("splat")];
  if (splat && splat.length) {
    return splat.length === 1
      ? JSON.stringify(splat[0])
      : JSON.stringify(splat);
  }
  return "";
};

const customFormat = winston.format.printf(
  ({ timestamp, level, message = "", ...meta }) =>
    `[${timestamp}] ${level}\t ${message} ${formatMeta(meta)}`
);

// Todo: log into a file on production builds
// logger.add(new winston.transports.Console({ format: winston.format.json() }))
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        level: true,
      }),
      winston.format.timestamp({
        format: "YY-MM-DD HH:mm:SS",
      }),
      customFormat
    ),
  })
);
export default logger;
