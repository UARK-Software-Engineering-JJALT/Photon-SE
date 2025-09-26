import socket
localIP = '0.0.0.0'
broadPort = '7500'
recPort = '7501'
bufferSize = 1024


class NetworkHandler(socket.socket): 
    def __init__(self, recPort, host=''):
        super().__init__(socket.AF_INET, socket.SOCK_STREAM)
        self.recPort = recPort
        self.bind(host, self.recPort)
        
    
    