// src/services/caching/caching.service.ts

type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

interface CacheItem<T> {
  value: T;
  expiry: number | null;
}

/**
 * A generic caching service that supports multiple storage backends and TTL.
 */
export class CachingService {
  private storage: Storage;
  private memoryCache = new Map<string, string>();

  constructor(storageType: StorageType = 'localStorage') {
    if (storageType === 'localStorage' && typeof window !== 'undefined') {
      this.storage = window.localStorage;
    } else if (storageType === 'sessionStorage' && typeof window !== 'undefined') {
      this.storage = window.sessionStorage;
    } else {
      // Fallback to in-memory storage if localStorage is not available or specified
      this.storage = this.createMemoryStorage();
    }
  }

  private createMemoryStorage(): Storage {
    return {
      getItem: (key: string): string | null => this.memoryCache.get(key) ?? null,
      setItem: (key: string, value: string): void => this.memoryCache.set(key, value),
      removeItem: (key: string): void => this.memoryCache.delete(key),
      clear: (): void => this.memoryCache.clear(),
      key: (index: number): string | null => [...this.memoryCache.keys()][index] ?? null,
      get length(): number {
        return this.memoryCache.size;
      },
    };
  }

  /**
   * Sets a value in the cache.
   * @param key The key for the cache item.
   * @param value The value to store.
   * @param ttlSeconds The time-to-live in seconds. If null or 0, item will not expire.
   */
  public set<T>(key: string, value: T, ttlSeconds: number | null = null): void {
    try {
      const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
      const cacheItem: CacheItem<T> = { value, expiry };
      this.storage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error(`[CachingService] Error setting item '${key}':`, error);
    }
  }

  /**
   * Gets a value from the cache.
   * @param key The key of the item to retrieve.
   * @returns The cached value, or null if it doesn't exist or has expired.
   */
  public get<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(key);
      if (!itemStr) {
        return null;
      }

      const item: CacheItem<T> = JSON.parse(itemStr);

      if (item.expiry && Date.now() > item.expiry) {
        this.storage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`[CachingService] Error getting item '${key}':`, error);
      return null;
    }
  }

  /**
   * Removes an item from the cache.
   * @param key The key of the item to remove.
   */
  public remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`[CachingService] Error removing item '${key}':`, error);
    }
  }

  /**
   * Clears the entire storage.
   */
  public clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error(`[CachingService] Error clearing storage:`, error);
    }
  }
}
