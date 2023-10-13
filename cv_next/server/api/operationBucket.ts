// import 'server-only'

/**
 * OperationBucket - hold an instance for query requests.
 * Operates as a query "session" manager, where every instance
 * can make token-number of requests in a specific rate-limit
 * time. (useful for code-handled rate limitting)
 */
export default class OperationBucket {
  private static operationBucketInstance?: OperationBucket;
  private maxTokens: number;
  private tokens: number;
  private refillRate: number;
  private lastRefillTimestamp: number;
  private interval: NodeJS.Timer | undefined;

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokens = maxTokens;
    this.lastRefillTimestamp = Date.now();
  }

  private refillTokens(operationBucket: OperationBucket) {
    const now = Date.now();
    const elapsedTime = now - operationBucket.lastRefillTimestamp;
    const tokensToAdd = Math.floor(
      elapsedTime * (operationBucket.refillRate / 1000)
    );

    operationBucket.tokens = Math.min(
      operationBucket.tokens + tokensToAdd,
      operationBucket.maxTokens
    );
    operationBucket.lastRefillTimestamp = now;
  }

  public tryConsumeToken() {
    if (this.interval === undefined) {
      this.startInterval();
    }
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  private startInterval() {
    if (this.interval !== undefined) {
      return;
    }
    // Start the periodic task
    const interval = setInterval(this.refillTokens, 1000, this); // Execute task every 1 second (1000 milliseconds)
    this.interval = interval;
  }

  public stopInterval() {
    if (this.interval === undefined) {
      return;
    }
    clearInterval(this.interval);
    this.interval = undefined;
  }
}
