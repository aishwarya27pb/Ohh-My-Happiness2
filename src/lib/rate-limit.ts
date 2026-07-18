interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private cache = new Map<string, { count: number; expiresAt: number }>();
  private limit: number;
  private windowMs: number;

  constructor(options: { limit: number; windowMs: number }) {
    this.limit = options.limit;
    this.windowMs = options.windowMs;
  }

  public check(id: string): RateLimitResult {
    const now = Date.now();
    const record = this.cache.get(id);
    
    // Clean up expired records occasionally to prevent unbounded memory growth
    if (this.cache.size > 10000) {
      this.cleanup();
    }

    if (!record || record.expiresAt < now) {
      this.cache.set(id, { count: 1, expiresAt: now + this.windowMs });
      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: now + this.windowMs,
      };
    }

    const newCount = record.count + 1;
    this.cache.set(id, { ...record, count: newCount });

    return {
      success: newCount <= this.limit,
      limit: this.limit,
      remaining: Math.max(0, this.limit - newCount),
      reset: record.expiresAt,
    };
  }
  
  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }
}
