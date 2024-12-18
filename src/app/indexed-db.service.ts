import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private dbName = 'dropdownState';
  private storeName = 'categories';

  constructor() {
    this.openDatabase();
  }

  private openDatabase(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onerror = (event) => {
      console.error('Database error:', event);
    };
  }

  saveState(state: any): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      store.put({ id: 1, selectedCategories: state });

      transaction.oncomplete = () => {
        console.log('State saved!');
      };
      transaction.onerror = (event: Event) => {
        console.error('Transaction error:', event);
      };
    };
  }




  loadState(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);

        const getRequest = store.get(1);

        getRequest.onsuccess = () => {
          resolve(getRequest.result ? getRequest.result.selectedCategories : []);
        };
        getRequest.onerror = () => {
          reject('Error loading state');
        };
      };
    });
  }


}
