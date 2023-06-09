export default class OperationBucket {
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

  private refillTokens() {
    const now = Date.now();
    const elapsedTime = now - this.lastRefillTimestamp;
    const tokensToAdd = Math.floor(elapsedTime * (this.refillRate / 1000));

    this.tokens = Math.min(this.tokens + tokensToAdd, this.maxTokens);
    this.lastRefillTimestamp = now;
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
    const interval = setInterval(this.refillTokens, 1000); // Execute task every 1 second (1000 milliseconds)
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
