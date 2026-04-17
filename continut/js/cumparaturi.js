const myWorker = new Worker('js/worker.js');

let tbody = document.getElementById("corpulTabelului");


myWorker.onmessage = (e) => {
    let tbody = document.getElementById("corpulTabelului");
    tbody.innerHTML = e.data; // actualizăm doar conținutul tabelului, nu întregul element
    //result.textContent = e.data;
    console.log("Am primit mesajul de la worker: ", e.data);    
};

myWorker.onerror = (err) => {
    console.error("Eroare în worker:", err.message);
};

class Produs {
    constructor(nume, cantitate, id) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = id;
    }
}

//catalog = []; // lista de produse

catalog = JSON.parse(localStorage.getItem("catalog")) || [];
id = catalog.length ? catalog[catalog.length - 1].id + 1 : 1; // asigurăm un ID unic pentru fiecare produs

function adaugaProdus() {
    console.log("Adăugăm produsul în catalog...");
    let nume = document.getElementById("nume").value;
    let cantitate = document.getElementById("cantitate").value;
    if (nume === "" || cantitate === "") {
        alert("Te rog completează toate câmpurile!");
        return;
    }
    let produs = new Produs(nume, cantitate, id);
    catalog.push(produs);
    id++;

    localStorage.setItem("catalog", JSON.stringify(catalog));

    document.getElementById("nume").value = "";
    document.getElementById("cantitate").value = "";
    myWorker.postMessage(catalog);
}

function stergeCatalog(){
    if (confirm("Ești sigur că vrei să ștergi tot catalogul?")) {
        catalog = [];
        localStorage.removeItem("catalog");
        myWorker.postMessage(catalog); // trimitem un catalog gol pentru a actualiza tabela
        id = 1; // resetăm ID-ul pentru a începe de la 1 din nou
        // afiseazaCatalog();
    }
}



