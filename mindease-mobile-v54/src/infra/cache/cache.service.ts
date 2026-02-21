const memory = new Map<string, any>();

export class CacheService {
  static async get(key: string): Promise<any | null> {
    try {
      if (memory.has(key)) return memory.get(key);
      return null;
    } catch (e) {
      console.error("[CacheService] get erro:", e);
      return null;
    }
  }

  static async set(key: string, value: any): Promise<void> {
    try {
      memory.set(key, value);
    } catch (e) {
      console.error("[CacheService] set erro:", e);
    }
  }

  static async clear(prefix?: string): Promise<void> {
    try {
      if (!prefix) {
        memory.clear();
        return;
      }
      for (const k of Array.from(memory.keys())) {
        if (k.startsWith(prefix)) memory.delete(k);
      }
    } catch (e) {
      console.error("[CacheService] clear erro:", e);
    }
  }
}

export default CacheService;
