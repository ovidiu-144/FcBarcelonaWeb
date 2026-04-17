class MyStorage{
    save(catalog) {
        throw new Error("Metoda 'salveaza' trebuie implementată în clasa derivată!");
    }

    load(){
        throw new Error("Metoda 'incarca' trebuie implementată în clasa derivată!");
    }

    delete(){
        throw new Error("Metoda 'sterge' trebuie implementată în clasa derivată!");
    }   
}

class MyLocalStorage extends MyStorage {
    constructor(){
        super();
        this.key = "catalog";
    }

    save(catalog) {
        localStorage.setItem(this.key, JSON.stringify(catalog));
    }
    load(){
        return JSON.parse (localStorage.getItem(this.key));
    }
    delete(){
        localStorage.removeItem(this.key);
    }
}

class MyIndexedDB extends MyStorage {
    constructor() {
        super();
        this.dbName = "CumparaturiDB";
        this.storeName = "catalog";
        this.db = null;
    }

    init() {
        return new Promise ((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result; // obținem referința la baza de date
                if (!db.objectStoreNames.contains(this.storeName)) { // verificăm dacă baza de date există deja
                    db.createObjectStore(this.storeName, { keyPath: "id" }); // folosim "id" ca și cheie primară
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result; // stocăm referința la baza de date în instanța clasei
                resolve();
            }

            request.onerror = (event) => {
                reject("Eroare la deschiderea bazei de date: " + event.target.errorCode);
            }
        });
    }

    save(catalog) {
        const tx = this.db.transaction(this.storeName, "readwrite"); // deschidem o tranzacție în modul readwrite pentru a putea adăuga date
        const store = tx.objectStore (this.storeName); 
        
        store.clear();
        catalog.forEach((produs) => {
            store.add(produs);
        });
    }

    load(){
        return new Promise ((resolve, reject) => {
            const tx = this.db.transaction (this.storeName, "readonly");
            const store = tx.objectStore (this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve (request.result);
            request.onerror = () => reject ("Eroare la incarcare");
        });
    }
    delete(){
        const tx = this.db.transaction (this.storeName, "readwrite");
        tx.objectStore (this.storeName).clear();
    }
}