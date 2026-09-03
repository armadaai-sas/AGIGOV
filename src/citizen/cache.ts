import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface CitizenCacheDB extends DBSchema {
  cache: {
    key: string;
    value: { data: unknown; savedAt: string };
  };
}

const DB_NAME = 'agigov-citizen-cache';
const STORE = 'cache';

async function db(): Promise<IDBPDatabase<CitizenCacheDB>> {
  return openDB<CitizenCacheDB>(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE);
    },
  });
}

export async function readCache<T>(key: string): Promise<T | null> {
  const entry = await (await db()).get(STORE, key);
  return entry ? (entry.data as T) : null;
}

export async function writeCache(key: string, data: unknown): Promise<void> {
  await (await db()).put(STORE, { data, savedAt: new Date().toISOString() }, key);
}
