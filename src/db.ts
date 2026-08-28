import { isComfortCard, type BackupPayload, type ComfortCard } from './model';

const DATABASE = 'comfort-card-local';
const VERSION = 1;
const STORE = 'cards';

export type InvalidLocalCard = {
  key: IDBValidKey;
  routeId?: string;
  label: string;
};

export type LocalCards = {
  cards: ComfortCard[];
  invalidCards: InvalidLocalCard[];
};

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

export async function getCards(): Promise<LocalCards> {
  const database = await openDatabase();
  const store = database.transaction(STORE).objectStore(STORE);
  const results = await requestResult(store.getAll() as IDBRequest<unknown[]>);
  database.close();
  const cards: ComfortCard[] = [];
  const invalidCards: InvalidLocalCard[] = [];
  results.forEach((result, index) => {
    if (isComfortCard(result)) {
      cards.push(result);
      return;
    }
    const record = result && typeof result === 'object' ? result as Record<string, unknown> : {};
    invalidCards.push({
      // The original importer required an id, and this key-path store uses it
      // as the IndexedDB key. Records without one cannot have been imported.
      key: typeof record.id === 'string' ? record.id : `unrecoverable-${index}`,
      routeId: typeof record.id === 'string' ? record.id : undefined,
      label: typeof record.game === 'string' && record.game.trim() ? record.game.slice(0, 80) : `Saved record ${index + 1}`,
    });
  });
  return { cards: cards.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), invalidCards };
}

export async function saveCard(card: ComfortCard): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(STORE, 'readwrite').objectStore(STORE).put(card));
  database.close();
}

export async function removeCard(id: IDBValidKey): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(STORE, 'readwrite').objectStore(STORE).delete(id));
  database.close();
}

export async function importCards(cards: ComfortCard[]): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORE, 'readwrite');
  cards.forEach((card) => transaction.objectStore(STORE).put(card));
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error('A local restore did not complete. Nothing was restored.'));
    transaction.onabort = () => reject(new Error('A local restore did not complete. Nothing was restored.'));
  });
  database.close();
}

export function makeBackup(cards: ComfortCard[]): BackupPayload {
  return { kind: 'comfort-card-backup', version: 1, exportedAt: new Date().toISOString(), cards };
}
