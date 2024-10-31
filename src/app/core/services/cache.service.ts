import { Injectable } from '@angular/core';

export interface CachedData {
  data: any;
  // epoch time (ms)
  expires: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private _cache: Map<string, CachedData> = new Map<string, CachedData>();

  get<T>(key: string): T | null {
    const cached = this._cache.get(key) ?? JSON.parse(localStorage.getItem(key) ?? 'null');
    if (!cached) {
      return null;
    }

    if (cached.expires < Date.now()) {
      this.delete(key);
      return null;
    }

    return cached.data;
  }

  set<T>(key: string, data: T, ttl: number = Infinity): void {
    const value = { data, expires: Date.now() + ttl };
    this._cache.set(key, { data, expires: Date.now() + ttl });
    localStorage.setItem(key, JSON.stringify(value));
  }

  private delete(key: string): void {
    this._cache.delete(key);
    localStorage.removeItem(key);
  }
}
