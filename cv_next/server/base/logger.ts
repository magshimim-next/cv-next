import "server-only";

namespace MyLogger {
  const isDebugMode = process.env.NODE_ENV === "development";
  //TODO: replace with real logger
  function logOperation(operation: string, type: string, obj?: unknown) {
    // eslint-disable-next-line no-console
    console.log(
      `----------------------\n` +
        `${type} Application LOG: ${new Date().toUTCString()}\n${operation}\n`,
      obj !== undefined && obj !== null ? obj : "",
      `\n----------------------\n`
    );
  }

  export function logDebug(message: string, obj?: unknown) {
    if (isDebugMode) {
      logOperation(message, "DEBUG", obj);
    }
  }

  export function logInfo(message: string, obj?: unknown) {
    logOperation(message, "INFO", obj);
  }

  export function logError(message: string, obj?: unknown) {
    if (isDebugMode) {
      logOperation(message, "ERROR", obj);
    }
  }
}

export default MyLogger;
