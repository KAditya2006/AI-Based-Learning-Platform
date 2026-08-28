interface CacheEntry {
  value: any;
  expiresAt: number;
}

export class CacheService {
  private static cache = new Map<string, CacheEntry>();

  static set(key: string, value: any, ttlSeconds: number = 3600): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  /**
   * Retrieves from cache, or executes the fetcher function if cache misses or is expired.
   */
  static async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number = 3600): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return cached;

    const value = await fetcher();
    this.set(key, value, ttlSeconds);
    return value;
  }
}
