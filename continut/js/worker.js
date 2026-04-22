
self.onmessage = function(e) {
    console.log("Am primit mesajul: ", e.data);

    let tbody = afiseazaCatalog(e.data);
    console.log("Am actualizat tabela: ", tbody);
    postMessage(tbody);
};

function afiseazaCatalog(playerList) {

    
    let tbody = "";

    playerList.forEach((player) => {
        tbody += `<tr>
            <td>${player.id}</td>
            <td>${player.name}</td>
            <td>${player.value}</td>
        </tr>`;
    });
    if (tbody === "") {
        tbody = "<tr><td colspan='3'>Catalog este gol</td></tr>";
    }

    return tbody;
}



    



