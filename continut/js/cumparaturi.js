//  import { MyStorage, LocalStorage, IndexedDB } from './js/storage.js';

class Product {
    constructor(nume, cantitate, id) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = id;
    }
}

const myWorker = new Worker('js/worker.js');

let tbody = document.getElementById("corpulTabelului");

let activeStorage = new MyLocalStorage();


myWorker.onmessage = (e) => {
    let tbody = document.getElementById("corpulTabelului");
    tbody.innerHTML = e.data; // actualizăm doar conținutul tabelului, nu întregul element
    //result.textContent = e.data;
    console.log("Am primit mesajul de la worker: ", e.data);    
};

myWorker.onerror = (err) => {
    console.error("Eroare în worker:", err.message);
};

let catalog = [];
let id = 1;


async function setStorage(){
    let storageType = document.getElementById("storageType").value;
    if (storageType === "localStorage") {
        activeStorage = new MyLocalStorage();
    } else if (storageType === "indexedDB") {
        activeStorage = new MyIndexedDB();
        await activeStorage.init();
    }
    let loadedCatalog = await activeStorage.load();
    catalog = loadedCatalog || []; // încărcăm catalogul din nou folosind noua stocare selectată
    myWorker.postMessage(catalog); // trimitem catalogul actualizat pentru a actualiza tabela
    id = catalog.length ? catalog[catalog.length - 1].id + 1 : 1; // actualizăm ID-ul pentru a continua de la ultimul produs adăugat
}

function adaugaProdus() {
    console.log("Adăugăm produsul în catalog...");
    let nume = document.getElementById("nume").value;
    let cantitate = document.getElementById("cantitate").value;
    if (nume === "" || cantitate === "") {
        alert("Te rog completează toate câmpurile!");
        return;
    }
    let produs = new Product(nume, cantitate, id);
    catalog.push(produs);
    id++;

    activeStorage.save(catalog);

    document.getElementById("nume").value = "";
    document.getElementById("cantitate").value = "";
    myWorker.postMessage(catalog);
}

function stergeCatalog(){
    if (confirm("Ești sigur că vrei să ștergi tot catalogul?")) {
        catalog = [];
        activeStorage.delete(); // ștergem catalogul din stocare
        myWorker.postMessage(catalog); // trimitem un catalog gol pentru a actualiza tabela
        id = 1; // resetăm ID-ul pentru a începe de la 1 din nou
        // afiseazaCatalog();
    }
}

window.onload = function() {
    setStorage(); // încărcăm catalogul și actualizăm tabela la încărcarea paginii
}

