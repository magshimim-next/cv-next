import "server-only";
import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({ colorize: true });
const logger = pino({ level: "trace" }, stream);

export default logger;

/**
 * Logs the result if it is not ok, including error information and stack trace if available.
 *
 * @param {Result<any, string>} result - the result to be logged
 */
export function logErrorWithTrace(result: Result<any, string>) {
  if (!result.ok) {
    logger.error({
      where: result.where,
      postgrestError: result.errors.postgrestError ?? undefined,
      authError: result.errors.authError ?? undefined,
      err: result.errors.err ?? undefined,
    });

    // print whole stack trace/error info to console
    if (
      result.errors.postgrestError ||
      result.errors.err ||
      result.errors.authError
    ) {
      // eslint-disable-next-line no-console
      logger.error({
        where: result.where,
        postgrestError: result.errors.postgrestError ?? undefined,
        authError: result.errors.authError ?? undefined,
        err: result.errors.err ?? undefined,
      });
    }
  }
}
