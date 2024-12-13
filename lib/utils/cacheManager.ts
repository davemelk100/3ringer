export class ScheduleCacheManager {
  private static CACHE_KEY = 'schedule_state_v1';
  private static cache = new Map<string, any>();

  static saveState(state: any) {
    try {
      // In-memory cache
      this.cache.set(this.CACHE_KEY, state);
      
      // Persistent cache
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          this.CACHE_KEY, 
          JSON.stringify({
            timestamp: Date.now(),
            state
          })
        );
      }
    } catch (error) {
      console.warn('Cache save failed:', error);
    }
  }

  static loadState(): any | null {
    try {
      // Try in-memory first
      const memoryCache = this.cache.get(this.CACHE_KEY);
      if (memoryCache) return memoryCache;

      // Fall back to session storage
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(this.CACHE_KEY);
        if (cached) {
          const { timestamp, state } = JSON.parse(cached);
          
          // Validate cache age (15 minutes)
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            this.cache.set(this.CACHE_KEY, state);
            return state;
          }
        }
      }
    } catch (error) {
      console.warn('Cache load failed:', error);
    }
    return null;
  }

  static clearCache() {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.CACHE_KEY);
    }
  }
} 