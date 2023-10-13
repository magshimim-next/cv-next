// import 'server-only'

export enum ErrorReasons {
    noErr,
    undefinedErr,
    emailExists,
    rateLimitPerSecondReached,
}
  
export const enumToStringMap: Record<ErrorReasons, string> = {
    [ErrorReasons.noErr]: "No Error",
    [ErrorReasons.undefinedErr]: "Undefined Error",
    [ErrorReasons.emailExists]: "Email already exists!",
    [ErrorReasons.rateLimitPerSecondReached]: "Rate limit per second reached",
};
  
export class RateLimitError extends Error {
    constructor() {
      super();
      this.cause = enumToStringMap[ErrorReasons.rateLimitPerSecondReached];
    }
}
  
export class DbOperationResult {
    public success: boolean;
    public data: any;
    public reason: ErrorReasons;
    public reasonString: string;
  
    constructor(success: boolean, reason: ErrorReasons, data: any) {
      this.success = success;
      this.reason = reason;
      this.reasonString = enumToStringMap[reason];
      this.data = data;
    }
}