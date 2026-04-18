

function afisareData(){
    //alert ("Salut, bine ai venit pe site-ul meu!");
    let date = new Date();
    document.getElementById('data').innerHTML = "Data curenta este: " + date.toLocaleDateString();
}

function afisareTimp(){
    let date = new Date();
    document.getElementById('timp').innerHTML = "Ora curentă este: " + date.toLocaleTimeString();
}

function afisareURL(){
    document.getElementById('url').innerHTML = "Adresa URL a paginii este: " + window.location.href;
}

function afisareLocatie(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            document.getElementById('locatie').innerHTML = "Latitudine: " + position.coords.latitude + "<br>Longitudine: " + position.coords.longitude;
        });
    } else {
        document.getElementById('locatie').innerHTML = "Geolocația nu este suportată de acest browser.";
    }
}

function afisareBrowser(){
    let broserName = navigator.appName;
    let browserVersion = navigator.appVersion;
    document.getElementById('numeBrowser').innerHTML = "Numele browserului este: " + broserName;
    document.getElementById('versiuneBrowser').innerHTML = "Versiunea browserului este: " + browserVersion;
}   

function resetare(){
    document.getElementById('data').innerHTML = "";
    document.getElementById('timp').innerHTML = "";
    document.getElementById('url').innerHTML = "";
    document.getElementById('locatie').innerHTML = "";
    document.getElementById('numeBrowser').innerHTML = "";
    document.getElementById('versiuneBrowser').innerHTML = "";
}

function desenareDreptunghi(){
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    let fillColour = document.getElementById('fillColour').value;
    ctx.fillStyle = fillColour;

    let contColour = document.getElementById('contColour').value;
    ctx.strokeStyle = contColour;
    ctx.lineWidth = 2;

    let x1 = parseInt(document.getElementById('x1').innerHTML);
    let y1 = parseInt(document.getElementById('y1').innerHTML);
    let x2 = parseInt(document.getElementById('x2').innerHTML);
    let y2 = parseInt(document.getElementById('y2').innerHTML);


    if (!isNaN(x1) && !isNaN(x2) ) {
        let width = x2 - x1;
        let height = y2 - y1;

        ctx.fillRect(x1, y1, width, height);
        ctx.strokeRect(x1, y1, width, height);
    }
}


function getMousePosition(canvas, event) {

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    //primul click - setam x1, y1
    if (document.getElementById('x1').innerHTML == "") {
        document.getElementById('x1').innerHTML = x;
        document.getElementById('y1').innerHTML = y;
    }
    //al doilea click - setam x2, y2
    else if (document.getElementById('x2').innerHTML == "") {
        document.getElementById('x2').innerHTML = x;
        document.getElementById('y2').innerHTML = y;
    }
    //al treilea click - resetam totul
    else {
        //resetam coordonatele
        document.getElementById('x1').innerHTML = "";
        document.getElementById('y1').innerHTML = "";
        document.getElementById('x2').innerHTML = "";
        document.getElementById('y2').innerHTML = "";

        //resetam canvasul
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

}


// Adăugăm un event listener pentru click pe întregul document dupa ce pagina s-a încărcat complet
document.addEventListener('click', function(event) {
    // Verificăm dacă elementul pe care s-a dat click are ID-ul 'myCanvas'
    if (event.target && event.target.id === 'myCanvas') {
        let canvas = event.target;
        getMousePosition(canvas, event);
        desenareDreptunghi();
    }
});



///functie pentru adaugarea unei linii in tabel
function addRow(){
    let table = document.getElementById('dynamicTable');
    let pos = parseInt(document.getElementById('posInput').value);
    let color = document.getElementById('colorPicker').value;

    if (isNaN(pos) || pos < 1 || pos > table.rows.length + 1) {
        alert("Te rog introdu o poziție validă între 1 și " + (table.rows.length + 1));
        return;
    }

    const colCount = table.rows[0].cells.length;
    let newRow = table.insertRow(pos);
    for (let i = 0; i < colCount; i++) {
        let newCell = newRow.insertCell(i);
        newCell.innerHTML = "Nou";
        newCell.style.color = color;
        newCell.style.backgroundColor = color;
    }
}

function addColumn(){
    let table = document.getElementById('dynamicTable');
    let pos = parseInt(document.getElementById('posInput').value);
    let color = document.getElementById('colorPicker').value;

    if (isNaN(pos) || pos < 1 || pos > table.rows[0].cells.length + 1) {
        alert("Te rog introdu o poziție validă între 1 și " + (table.rows[0].cells.length + 1));
        return;
    }

    for (let i = 0; i < table.rows.length; i++) {
        let newCell = table.rows[i].insertCell(pos);
        newCell.innerHTML = "Nou";
        newCell.style.color = color;
        newCell.style.backgroundColor = color;
    }

}


function schimbaContinut(resursa, tip = "html") {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("continut").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", resursa + ".html", true);
  xhttp.send();
}


function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
        }
    };
    xhttp.open("GET", "resurse\\persoane.xml", true);
    xhttp.send();
}


//forma XML
    // <jucator id="1">
    //     <nume> ter Stegen </nume>
    //     <prenume> Marc-Andre </prenume>
    //     <varsta> 32 </varsta>
    //     <nationalitate> Germania </nationalitate>
    //     <pozitie> Portar </pozitie>
    //     <numar_tricou> 1 </numar_tricou>
    //     <valoare_piata> 20000000 </valoare_piata>
    //     <contract>
    //         <inceput> 2017-07-01 </inceput>
    //         <sfarsit> 2028-06-30 </sfarsit>
    //         <salariu_saptamanal> 220000 </salariu_saptamanal>
    //         <clauze>
    //             <clauza> Clauza de reziliere: 400000000 </clauza>
    //         </clauze>
    //     </contract>
    // </jucator>


function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<tr><th>Prenume</th><th>Nume</th><th>Varsta</th><th>Nationalitate</th><th>Pozitie</th><th>Numar Tricou</th><th>Valoare Piata</th><th>Inceput</th><th>Sfarsit</th><th>Salariu</th></tr>";
    var x = xmlDoc.getElementsByTagName("jucator");
    for (i = 0; i < x.length; i++) { 
        table += "<tr><td>" +
        x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("nationalitate")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("pozitie")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("numar_tricou")[0].childNodes[0].nodeValue +
            "</td><td>" +
        x[i].getElementsByTagName("valoare_piata")[0].childNodes[0].nodeValue +
            "</td><td>";
        
        var contract = x[i].getElementsByTagName("contract")[0];
        if (contract) {
            table +=contract.getElementsByTagName("inceput")[0].textContent + "</td><td>" +
                    contract.getElementsByTagName("sfarsit")[0].textContent + "</td><td>" +
                    contract.getElementsByTagName("salariu_saptamanal")[0].textContent;
        } else {
            // Dacă nu există contract, punem celule goale să nu stricăm tabelul
            table += "<td>-</td><td>-</td><td>-</td>";
        }
        table += "</td></tr>";
    }
    document.getElementById("demo").innerHTML = table;
}


function valideazaUtilizator() {
    // Luăm valorile introduse de utilizator
    let userIntrodus = document.getElementById('username').value;
    let passIntrodus = document.getElementById('password').value;
    let rezultatElement = document.getElementById('rezultat');

    // Creăm cererea AJAX pentru a lua fișierul JSON
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Verificăm dacă cererea a fost finalizată cu succes
        if (this.readyState == 4 && this.status == 200) {
            // Conversia textului JSON în obiect JavaScript
            let utilizatori = JSON.parse(this.responseText);
            let gasit = false;

            // Verificăm dacă datele se potrivesc
            for (let i = 0; i < utilizatori.length; i++) {
                if (utilizatori[i].utilizator === userIntrodus && utilizatori[i].parola === passIntrodus) {
                    gasit = true;
                    break;
                }
            }

            // Afișăm rezultatul
            if (gasit) {
                rezultatElement.innerHTML = "Utilizator și parolă corecte!";
                rezultatElement.style.color = "green";
            } else {
                rezultatElement.innerHTML = "Utilizator sau parolă incorectă!";
                rezultatElement.style.color = "red";
            }
        }
    };
    
    // Asigură-te că calea este corectă față de locul unde se află index.html
    xhttp.open("GET", "resurse\\utilizatori.json", true);
    xhttp.send();
}


function inregistreazaUtilizator() {
    let user = document.getElementById('name').value;
    let pass = document.getElementById('password').value;
    let mesaj = document.getElementById('mesajInregistrare');

    let dateUtilizator = {
        utilizator: user,
        parola: pass
    };

    // Creăm cererea AJAX pentru a trimite datele către server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                mesaj.innerHTML = "Utilizator înregistrat cu succes!";
                mesaj.style.color = "green";
            } else {
                mesaj.innerHTML = "Eroare la server: " + this.status;
                mesaj.style.color = "red";
            }
        }
    };

    // Deschidem cererea POST către calea virtuală
    xhttp.open("POST", "/api/utilizatori", true);
    
    // Setăm header-ul pentru a informa serverul că trimitem date JSON
    xhttp.setRequestHeader("Content-Type", "application/json");
    
    // Transformăm obiectul JavaScript în șir JSON și îl trimitem
    xhttp.send(JSON.stringify(dateUtilizator));


}