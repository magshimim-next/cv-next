import "server-only";
import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({ colorize: true });
const logger = pino({ level: "trace" }, stream);

export default logger;
