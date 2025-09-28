import socket
import threading 
import asyncio
import queue 

#Expected Values (can be removed if everyone already gets it)
localIP = '0.0.0.0'
broadPort = 7500
recPort = 7501
bufferSize = 1024


class NetworkHandler(socket.socket): 
    def __init__(self, recPort, broadPort, bufferSize, host='',):
        super().__init__(socket.AF_INET, socket.SOCK_DGRAM)
        
        #Allows socket to send and recieve messages
        self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

        self.recPort = recPort
        self.broadPort = broadPort
        self.bufferSize = bufferSize
        self.listening = False
        self.messageHandler = None
        self.connected_clients = set()
        self.message_queue = queue.Queue()
        self.event_loop = None

    def set_event_loop(self, loop):
        #Set asyncio event loop for websocket forwarding
        self.event_loop = loop

    def add_websocket_client(self, websocket):
        self.connected_clients.add(websocket)
        print(f"Websocket client add.")

    def remove_websocket_client(self, websocket):
        self.connected_clients.discard(websocket)
        print(f"Websocket client removed.")


    def start_receiver(self, host='', port=None):
        #listen for messages
        if port:
            self.recPort = port
        
        try: 
            bind_host = host if host else ''
            self.bind((bind_host, self.recPort))
            self.listening = True
            print(f"UDP reciever started on {self.recPort}")
            threading.Thread(target=self.listen_for_message, daemon=True).start()
        
        except Exception as e:
            print("Error starting UDP reciever")
    
    def listen_for_message(self):
        #listen indefinitely 
        while self.listening:
            try:
                data, address = self.recvfrom(self.bufferSize)
                message = data.decode()
                print(f"Recieved from {address} : {message}")

                if self.messageHandler:
                    self.messageHandler(message, address)
                
                #if there's an event loop, schedule forwarding
                if self.event_loop and self.connected_clients:
                    asyncio.run_coroutine_threadsafe(self.forward_to_websockets(message, address), self.event_loop)

                #forward to Websocket client after forwarding to MH
                self.message_queue.put((message, address))

            except Exception as e:
                if self.listening:
                    print(f"Failed Recieving message: {e}")
    
    def set_message_handler(self, handler):
        self.messageHandler = handler
    
    async def broadcast_message(self, message: str):
        #touching leo's little function
        try: 
            from main import broadcast
            await broadcast(message)
            print(f"Broadcasted via main: {message}")
        except Exception as e:
            print(f"Failed to broadcast via main: {e}")

    def broadcast_udp_message(self, message):
        #Broadcast via UDP
        try: 
            if isinstance(message, str):
                message = message.encode("utf-8")

            self.sendto(message, ('<broadcast>', self.broadPort))
            print(f"UDP message broadcasted to port {self.broadPort}")

        except Exception as e:
            print(f"Failed to broadcast UDP message: {e}")
        
    def send_udp_message(self, message, host, port):
        #Send UDP messages
        try:
            if isinstance(message, str):
                message = message.encode("utf-8")

            self.sendto(message, (host, port))
            print(f"UDP message sent to {host}:{port}")

        except Exception as e:
            print(f"Failed to send UDP message to {host}:{port}")
    
    async def forward_to_websockets(self, message, address):
        if self.connected_clients:
            formatted_message = f"UDP from {address}: {message}"
            await self.broadcast_message(formatted_message)

    def send_message(self, message, host, port):
        #send message upon broadcast
        try:
            if isinstance(message, str):
                message = message.encode("utf-8")
            
            self.sendto(message, (host, port))
            print(f"Message sent to {host} : {port}")
        
        except Exception as e:
            print(f"Failed to send message to {host} : {port}")
    
    def stop(self):
        self.listening = False
        self.close()



## Test function to simulate how this would work with your main.py
async def test_integration():
    print("Testing NetworkHandler with WebSocket simulation...")
    
    # Create network handler
    handler = NetworkHandler(recPort=7501, broadPort=7500, bufferSize=1024)
    
    # Set the event loop for proper WebSocket forwarding
    handler.set_event_loop(asyncio.get_running_loop())
    
    # Simulate WebSocket clients
    class MockWebSocket:
        def __init__(self, name):
            self.name = name
            self.messages = []
        
        async def send(self, message):
            self.messages.append(message)
            print(f"{self.name} received: {message}")
    
    # Add mock WebSocket clients
    client1 = MockWebSocket("Frontend Client 1")
    client2 = MockWebSocket("Frontend Client 2")
    handler.add_websocket_client(client1)
    handler.add_websocket_client(client2)
    
    # Start UDP receiver
    handler.start_receiver()
    
    # Wait for receiver to start
    await asyncio.sleep(1)
    
    # Test 1: Broadcast via WebSocket using main.py's broadcast style
    print("\n--- Test 1: WebSocket Broadcast ---")
    await handler.broadcast_message("Hello WebSocket clients!")
    
    # Test 2: Send UDP message (should forward to WebSocket clients)
    print("\n--- Test 2: UDP to WebSocket Forwarding ---")
    handler.broadcast_udp_message("Test UDP message")
    await asyncio.sleep(1)  # Allow time for forwarding
    
    # Test 3: Direct UDP communication
    print("\n--- Test 3: Direct UDP Communication ---")
    handler.send_udp_message("Direct UDP test", "127.0.0.1", 7501)
    await asyncio.sleep(1)
    
    # Cleanup
    handler.stop()
    print("Test completed")


if __name__ == "__main__":
    # Run the test
    asyncio.run(test_integration())