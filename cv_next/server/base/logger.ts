// import 'server-only'

export default class MyLogger {
  private static isDebugMode = process.env.NODE_ENV === "development";
  private static logOperation(operation: string, type: string, obj?: unknown) {
    console.log(
      `----------------------\n` +
        `${type} Application LOG: ${new Date().toUTCString()}\n${operation}\n`,
      obj !== undefined && obj !== null ? obj : "",
      `\n----------------------\n`
    );
  }

  public static logDebug(message: string, obj?: unknown) {
    if (MyLogger.isDebugMode) {
      MyLogger.logOperation(message, "DEBUG", obj);
    }
  }

  public static logInfo(message: string, obj?: unknown) {
    MyLogger.logOperation(message, "INFO", obj);
  }
}
