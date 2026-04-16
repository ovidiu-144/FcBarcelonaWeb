

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

function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<tr><th>Nume</th><th>Prenume</th><th>Varsta</th></tr>";
    var x = xmlDoc.getElementsByTagName("persoana");
    for (i = 0; i <x.length; i++) { 
        table += "<tr><td>" +
        x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
        "</td><td>" +
        x[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue +
        "</td><td>" +
        x[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue +
        "</td></tr>";
    }
    document.getElementById("demo").innerHTML = table;
}