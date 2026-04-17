self.onmessage = function(e) {
    //alert("Am primit mesajul: " + e.data);
    console.log("Am primit mesajul: ", e.data);

    let tbody = afiseazaCatalog(e.data);
    console.log("Am actualizat tabela: ", tbody);
    postMessage(tbody);
};

function afiseazaCatalog(catalog) {

    
    // alert("Catalogul a fost actualizat! Verifică tabela pentru detalii.");
    // 1. Curățăm conținutul vechi al tabelului pentru a nu dubla datele
    let tbody = "";

    // 2. Parcurgem fiecare obiect din catalog folosind forEach
    catalog.forEach((produs) => {
        // Creăm un element de tip rând (tr)
        tbody += `<tr>
            <td>${produs.id}</td>
            <td>${produs.nume}</td>
            <td>${produs.cantitate}</td>
        </tr>`;
    });
    if (tbody === "") {
        tbody = "<tr><td colspan='3'>Catalog este gol</td></tr>";
    }

    return tbody;
}



// function afiseazaCatalog() {
//     const tbody = document.getElementById("corpulTabelului");
    
//     // 1. Curățăm conținutul vechi al tabelului pentru a nu dubla datele
//     tbody.innerHTML = "";

//     // 2. Parcurgem fiecare obiect din catalog folosind forEach
    // catalog.forEach((produs) => {
    //     // Creăm un element de tip rând (tr)
    //     const rand = document.createElement("tr");

    //     // Setăm conținutul rândului folosind Template Literals
    //     rand.innerHTML = `
    //         <td>${produs.id}</td>
    //         <td>${produs.nume}</td>
    //         <td>${produs.cantitate}</td>
    //     `;

    //     // 3. Adăugăm rândul creat în corpul tabelului
    //     tbody.appendChild(rand);
    // });
// }