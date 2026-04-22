

class Player {
    constructor(name, value, id) {
        this.name = name;
        this.value = value;
        this.id = id;
    }
}

const myWorker = new Worker('js/worker.js');

let tbody = document.getElementById("playersTableBody");

let activeStorage = new MyLocalStorage();


myWorker.onmessage = (e) => {
    let tbody = document.getElementById("playersTableBody");
    tbody.innerHTML = e.data;
    console.log("Am primit mesajul de la worker: ", e.data);    
};

myWorker.onerror = (err) => {
    console.error("Eroare în worker:", err.message);
};

let playerList = [];
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
    playerList = loadedCatalog || [];
    myWorker.postMessage(playerList);
    id = playerList.length ? playerList[playerList.length - 1].id + 1 : 1;
}

async function addPlayer() {
    console.log("Adăugăm produsul în catalog...");
    let name = document.getElementById("name").value;
    if (name === "") {
        alert("Te rog completează toate câmpurile!");
        return;
    }
    const res = await fetch ('/api/market_value', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            player_name: name
        })
    });
    if (res.status !== 200) {
        alert("A apărut o eroare la căutarea jucătorului. Te rog încearcă din nou.");
        return;
    }

    const data = await res.json();

    if (barcelonaPlayers.includes(data.player_name)) {
        alert("Jucătorul " + data.player_name + " este în lotul Barcelonei! Cota de piață: " + data.market_value);
    }

    else if (playerList.some(p => p.name === data.player_name)) {
        alert("Jucătorul " + data.player_name + " a fost deja adăugat în catalog! Cota de piață: " + data.market_value);
    }
    else {

        console.log("Cota de piață pentru " + data.player_name + ": " + data.market_value);

        let produs = new Player(data.player_name, data.market_value, id);
        playerList.push(produs);
        id++;

        await activeStorage.save(playerList);
    }

    document.getElementById("name").value = "";
    myWorker.postMessage(playerList);
}

function deleteList(){
    if (confirm("Ești sigur că vrei să ștergi tot catalogul?")) {
        playerList = [];
        activeStorage.delete();
        myWorker.postMessage(playerList);
        id = 1;
    }
}

function deletePlayer() {
    let name = document.getElementById("name").value;
    if (confirm("Ești sigur că vrei să ștergi jucătorul?")) {
        playerList = playerList.filter(p => p.name !== name);
        activeStorage.save(playerList);
        myWorker.postMessage(playerList);
    }
}


