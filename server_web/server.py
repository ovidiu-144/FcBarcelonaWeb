import gzip
import socket
import threading
import os
import json

import requests
from bs4 import BeautifulSoup
import time

def content_type(type):
    if type == "html":
        return "text/html"
    elif type == "css":
        return "text/css"
    elif type == "js":
        return "application/js"
    elif type == "jpg" or type == "jpeg":
        return "image/jpeg"
    elif type == "png":
        return "image/png"
    elif type == "gif":
        return "text/gif"
    elif type == "ico":
        return "image/x-icon"
    elif type == "json":
        return "application/json"
    elif type == "xml":
        return "application/xml"
    else:
        return ""


def get_player_market_value(player_name):

    time.sleep(1)
    search_url = f"https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query={player_name}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(search_url, headers=headers)


        soup = BeautifulSoup(response.content, 'html.parser')



        player_row = soup.select_one("table.items > tbody > tr") 


        if not player_row:
            return "Jucătorul nu a fost găsit."

        market_value_cell = player_row.select_one("td.rechts.hauptlink")
        
        full_name_tag = player_row.select_one("td.hauptlink a")
        full_name = full_name_tag.text.strip() if full_name_tag else player_name

        if market_value_cell and market_value_cell.text.strip() != "-":
            return full_name, market_value_cell.text.strip()
        else:
            return full_name, "Nu a fost găsită o cotă de piață / Jucătorul este retras."

    except Exception:
        return f"Eroare la obținerea cotei de piață pentru {player_name}."



def handle_client(clientsocket, address):
    print (f"[THREAD {threading.current_thread().name}] S-a conectat un client: {address}")
    try:
        request = ""
        start_line = ""
        while True:
            data = clientsocket.recv(4096)
            request = request + data.decode()
            pozitie = request.find('\r\n')
            if (pozitie > -1):
                start_line = request[0:pozitie]
            break
        
        accepts_gzip = 'gzip' in request.lower() and 'accept-encoding' in request.lower()

        method = start_line.split(' ')[0]
        resource = start_line.split(' ')[1]

        if method == 'POST' and resource == '/api/market_value':
            body = request.split('\r\n\r\n', 1)[1] if '\r\n\r\n' in request else ''
            
            data = json.loads(body)
            player_name = data.get("player_name")

            try:
                full_name, market_value = get_player_market_value(player_name)
                status = "200 OK"
                response = json.dumps({"player_name": full_name, "market_value": market_value}, ensure_ascii=False).encode('utf-8')
                type = "application/json; charset=utf-8"
                accepts_gzip = False
            except Exception as e:
                print(f"[API] Eroare la obținerea cotei de piață pentru {player_name}: {e}")
                full_name, market_value = "Eroare", f"Eroare la obținerea cotei de piață pentru {player_name}"
                status = "500 Internal Server Error"
                response = response = b"Internal Server Error"
                type = "application/json; charset=utf-8"



        elif method == 'POST' and resource == '/api/utilizatori':
            body = request.split('\r\n\r\n', 1)[1] if '\r\n\r\n' in request else ''
            
            utilizator = json.loads(body)

            path = os.path.join("continut", "resurse", "utilizatori.json")

            os.makedirs("resurse", exist_ok=True)
            utilizatori = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else []
            utilizatori.append(utilizator)
            json.dump(utilizatori, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

            print(f"[API] Utilizator salvat: {utilizator}")
            response = json.dumps({"mesaj": "Succes", "utilizator": utilizator}, ensure_ascii=False).encode('utf-8')
            type = "application/json; charset=utf-8"
            status = "200 OK"
            accepts_gzip = False

        else:
            try:
                file = resource
                if file == '/':
                    file = 'index.html'

                extension = file.rsplit('.', 1)[-1] if '.' in file else ''
                type = content_type(extension) + "; charset=utf-8"

                relative_path = os.path.join("continut", file.lstrip('/'))
                with open (relative_path, 'rb') as f:
                    response = f.read()
                status = "200 OK"
            except Exception as e:
                print (e)
                type = "text/html; charset=utf-8"
                response = b"File not found"
                status = "404 Not Found"
                accepts_gzip = False
        
        extra_headers = ""
        if accepts_gzip:
            response = gzip.compress(response)
            extra_headers += "Content-Encoding: gzip\r\n"
            print (f"[THREAD {threading.current_thread().name}] Clientul accepta gzip, se va trimite raspunsul comprimat.")
        
        headers = (
            f"HTTP/1.1 {status}\r\n"
            f"Content-Length: {len(response)}\r\n"
            f"Content-Type: {type}\r\n"
            f"{extra_headers}"
            f"Server: Python Server\r\n"
            f"Connection: close\r\n"
            f"\r\n"
        )
        
        clientsocket.sendall(headers.encode('utf-8') + response)
        print (f"[Thread {threading.current_thread().name}] Raspunsul a fost trimis catre client.")

    except Exception as e:
        print (f"[THREAD {threading.current_thread().name}] Eroare la citirea cererii: {e}")
    finally:
        clientsocket.close()
        print (f"[THREAD {threading.current_thread().name}] S-a terminat comunicarea cu clientul: {address}")

def server():
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.bind(('', 5678))
    serversocket.listen(5)

    print ('Serverul a pornit pe portul 5678...http://localhost:5678/')
    while True:
        print ("#" * 50)
        print ('Serverul asculta potentiali clienti')
        (clientsocket, address) = serversocket.accept()
        print (f"S-a conectat un client la {address}.")
        
        client_thread = threading.Thread(
            target=handle_client,
            args=(clientsocket, address),
            daemon=True
        )
        client_thread.start()
        print (f"[THREAD {client_thread.name}] A fost pornit un thread pentru a deservi clientul conectat la {address}.")

server()
