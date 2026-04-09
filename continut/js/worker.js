onmessage = (e) => {
  console.log("Am primit mesajul: ", e.data);
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  afiseazaCatalog();
  console.log("Am actualizat tabela: ", workerResult);
  postMessage(workerResult);
};

function afiseazaCatalog() {
    const tbody = document.getElementById("corpulTabelului");
    
    // 1. Curățăm conținutul vechi al tabelului pentru a nu dubla datele
    //tbody.innerHTML = "";

    // 2. Parcurgem fiecare obiect din catalog folosind forEach
    
    // Creăm un element de tip rând (tr)
    const rand = document.createElement("tr");

    // Setăm conținutul rândului folosind Template Literals
    rand.innerHTML = `
        <td>${produs.id}</td>
        <td>${produs.nume}</td>
        <td>${produs.cantitate}</td>
    `;

    // 3. Adăugăm rândul creat în corpul tabelului
    tbody.appendChild(rand);
}



// function afiseazaCatalog() {
//     const tbody = document.getElementById("corpulTabelului");
    
//     // 1. Curățăm conținutul vechi al tabelului pentru a nu dubla datele
//     tbody.innerHTML = "";

//     // 2. Parcurgem fiecare obiect din catalog folosind forEach
//     catalog.forEach((produs) => {
//         // Creăm un element de tip rând (tr)
//         const rand = document.createElement("tr");

//         // Setăm conținutul rândului folosind Template Literals
//         rand.innerHTML = `
//             <td>${produs.id}</td>
//             <td>${produs.nume}</td>
//             <td>${produs.cantitate}</td>
//         `;

//         // 3. Adăugăm rândul creat în corpul tabelului
//         tbody.appendChild(rand);
//     });
// }