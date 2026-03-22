

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