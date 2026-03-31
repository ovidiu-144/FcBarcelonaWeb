import socket

def content_type(type):
    if type == "html":
        return "text/html"
    elif type == "css":
        return "text/css"
    elif type == "js":
        return "application/js"
    elif type == "jpg":
        return "image/jpeg"
    elif type == "png":
        return "text/png"
    elif type == "jpg" or type == "jpeg":
        return "image/jpeg"
    elif type == "gif":
        return "text/gif"
    elif type == "ico":
        return "image/x-icon"
    else:
        return ""


def server():
    # creeaza un server socket
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
    serversocket.bind(('', 5678))
    # serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
    serversocket.listen(5)

    print ('Serverul a pornit pe portul 5678...http://localhost:5678/')
    while True:
        print ("#########################################################################")
        print ('Serverul asculta potentiali clienti')
        # asteapta conectarea unui client la server
        # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
        (clientsocket, address) = serversocket.accept()
        print ('S-a conectat un client.')
        
        # se proceseaza cererea si se citeste prima linie de text
        request = ""
        start_line = ""
        while True:
            data = clientsocket.recv(1024)
            request = request + data.decode()
            print ('S-a citit mesajul: \n---------------------------\n' + request + '\n---------------------------')
            pozitie = request.find('\r\n')
            if (pozitie > -1):
                start_line = request[0:pozitie]
            print ('S-a citit linia de start din cerere: ##### ' + start_line + '#####')
            break

        print ('S-a terminat cititrea.')
        
        # TODO interpretarea sirului de caractere `start_line` pentru a extrage numele resursei cerute

        try:
            file = start_line.split(' ')[1]
            type = content_type(file.split('.')[1]) + "; charset=utf-8"

            relative_path = "continut/" + file
            with open (relative_path, 'rb') as f:
                response = f.read()
            status = "200 OK"
        except Exception as e:
            print (e)
            type = "text/html; charset=utf-8"
            response = b"File not found"
            status = "404 Not Found"

        # response = "Hello World " + file
        lenght_response = len(response)
        content = "HTTP/1.1 " + status + "\r\n" + \
                "Content-Length: " + str(lenght_response) + "\r\n" + \
                "Content-Type: " + type + "\r\n" + \
                "Server: Python Server\r\n" + \
                "\r\n"
        
        # TODO trimiterea răspunsului HTTP
        clientsocket.sendall(content.encode('utf-8') + response)
        clientsocket.close()
        print ('S-a terminat comunicarea cu clientul.') 

server()

