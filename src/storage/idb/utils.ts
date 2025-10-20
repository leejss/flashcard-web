function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export function runTransaction<T>(
  db: IDBDatabase,
  store: string,
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const transaction = db.transaction([store], mode);
  const objectStore = transaction.objectStore(store);
  const request = executor(objectStore);
  return wrapRequest(request);
}
