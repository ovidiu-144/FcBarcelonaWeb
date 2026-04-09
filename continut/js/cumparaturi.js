class Produs {
    constructor(nume, cantitate, id) {
        this.nume = nume;
        this.cantitate = cantitate;
        this.id = id;
    }
}

//catalog = []; // lista de produse

catalog = JSON.parse(localStorage.getItem("catalog")) || [];
id = catalog.length;

function adaugaProdus() {
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
}

function stergeCatalog(){
    if (confirm("Ești sigur că vrei să ștergi tot catalogul?")) {
        catalog = [];
        localStorage.removeItem("catalog");
    }
}