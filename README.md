# FC Barcelona Web

Aplicație web statică + server Python, realizată pentru un proiect de programare web, cu tematică FC Barcelona.

> Documentația este redactată în limba română.

## Ce include proiectul

- Interfață web multi-pagină (încărcare dinamică de conținut cu `XMLHttpRequest`)
- Design personalizat (CSS) și pagini tematice (Acasă, Despre, Video, Desen SVG, Învăț, Jucători, Verificare, Transferuri)
- Formular de înregistrare cu validări în JavaScript și salvare utilizatori în JSON
- Autentificare pe baza datelor din `continut/resurse/utilizatori.json`
- Tabel dinamic cu jucători încărcați din XML (`persoane.xml`)
- Listă de transferuri cu stocare selectabilă (`localStorage` / `IndexedDB`) și Web Worker pentru randare
- API backend pentru cota de piață a jucătorilor (scraping Transfermarkt)
- Servire fișiere statice și suport pentru compresie gzip

## Structură repository

- `continut/` – fișierele interfeței web (HTML, CSS, JS, imagini, resurse XML/JSON)
- `continut/js/script.js` – logică principală UI (navigare, formulare, autentificare, tabel XML)
- `continut/js/cumparaturi.js` – logica listei de transferuri
- `continut/js/storage.js` – abstractizare stocare LocalStorage / IndexedDB
- `continut/js/worker.js` – Web Worker pentru afișarea catalogului
- `server_web/server.py` – server HTTP custom + endpoint-uri API
- `server_web/lanseaza_server.bat` – script de lansare server pe Windows

## Cerințe

- Python 3.x
- Pachete Python:
  - `requests`
  - `beautifulsoup4`

Instalare rapidă:

```bash
pip install requests beautifulsoup4
```

## Rulare

Din rădăcina proiectului:

```bash
python server_web/server.py
```

Serverul pornește pe:

- `http://localhost:5678/`

## Endpoint-uri backend

- `POST /api/utilizatori`
  - primește datele formularului de înregistrare
  - salvează în `continut/resurse/utilizatori.json`
- `POST /api/market_value`
  - primește `player_name`
  - întoarce jucătorul găsit + cota de piață

## Observații

- Nu există configurări dedicate de build/lint/test în repository.
- Proiectul este orientat pe rulare locală, prin serverul Python inclus.
