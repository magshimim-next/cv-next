import "server-only";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
});

// Todo: log into a file on production builds
// logger.add(new winston.transports.Console({ format: winston.format.json() }))
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({
        level: true,
      }),
      winston.format.timestamp({
        format: "YY-MM-DD HH:MM:SS",
      }),
      winston.format.printf((info) => {
        let out = "";
        if (info.message) {
          out = `${info.timestamp}  [${info.level}] : ${info.message}`;
        } else {
          out = `${info.timestamp}  [${info.level}] : @${info.where || "<unknown location>"} - ${info.postgrestError ? info.postgrestError.message : ""}${info.err ? info.err.message : ""}`;
        }

        return out;
      })
    ),
  })
);
export default logger;

/**
 * Logs the result if it is not ok, including error information and stack trace if available.
 *
 * @param {Result<any, string>} result - the result to be logged
 */
export function logErrorWithTrace(result: Result<any, string>) {
  if (!result.ok) {
    logger.error("", {
      where: result.where,
      postgrestError: result.postgrestError ?? undefined,
      err: result.err ?? undefined,
    });

    // print whole stack trace/error info to console
    if (result.postgrestError || result.err) {
      // eslint-disable-next-line no-console
      console.error(result.postgrestError ?? result.err);
    }
  }
}
