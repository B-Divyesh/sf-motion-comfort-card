import type { BackupPayload, ComfortCard } from './model';

const DATABASE = 'comfort-card-local';
const VERSION = 1;
const STORE = 'cards';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support private local storage.'));
      return;
    }
    const request = indexedDB.open(DATABASE, VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Comfort Card could not open local storage.'));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('A local save did not complete. Try again.'));
  });
}

export async function getCards(): Promise<ComfortCard[]> {
  const database = await openDatabase();
  const results = await requestResult(database.transaction(STORE).objectStore(STORE).getAll() as IDBRequest<ComfortCard[]>);
  database.close();
  return results.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveCard(card: ComfortCard): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(STORE, 'readwrite').objectStore(STORE).put(card));
  database.close();
}

export async function removeCard(id: string): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(STORE, 'readwrite').objectStore(STORE).delete(id));
  database.close();
}

export async function importCards(cards: ComfortCard[]): Promise<void> {
  const database = await openDatabase();
  await Promise.all(cards.map((card) => requestResult(database.transaction(STORE, 'readwrite').objectStore(STORE).put(card))));
  database.close();
}

export function makeBackup(cards: ComfortCard[]): BackupPayload {
  return { kind: 'comfort-card-backup', version: 1, exportedAt: new Date().toISOString(), cards };
}
