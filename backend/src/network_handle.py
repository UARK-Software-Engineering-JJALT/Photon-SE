import socket
import threading 
import asyncio
import queue 
import json

#Expected Values (can be removed if everyone already gets it)
localIP = '0.0.0.0'
broadPort = 7500
recPort = 7501
bufferSize = 1024


class NetworkHandler: 
    def __init__(self, recPort=7501, broadPort=7500, bufferSize=1024, host='0.0.0.0',):
        self.recPort = recPort
        self.broadPort = broadPort
        self.bufferSize = bufferSize
        self.host = host

        # UDP broadcast socket (for sending)
        self.udp_broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.udp_broadcast_sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

        # UDP receive socket
        self.udp_receive_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.udp_receive_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.udp_receive_sock.bind((self.host, self.recPort))

        # WebSocket clients
        self.connected_clients = set()

        # Async event loop
        self.loop = None

        # For message forwarding queue if needed
        self.message_queue = queue.Queue()
        self.listening = False

    def set_event_loop(self, loop):
        #Set asyncio event loop for websocket forwarding
        self.loop = loop

    def add_websocket_client(self, websocket):
        self.connected_clients.add(websocket)
        print(f"Websocket client add.")

    def remove_websocket_client(self, websocket):
        self.connected_clients.discard(websocket)
        print(f"Websocket client removed.")


    def start_receiver(self):
        self.listening = True
        threading.Thread(target=self.listen_for_message, daemon=True).start()
        print(f"UDP receiver started on {self.host}:{self.recPort}")
    
    def listen_for_message(self):
        while self.listening:
            try:
                data, addr = self.udp_receive_sock.recvfrom(self.bufferSize)
                message = data.decode("utf-8").strip()

                self.broadcast_udp_message(message.split(":")[-1])
                
                print(f"Received UDP from {addr}: {message}")

                # Forward to WebSocket clients
                if self.loop and self.connected_clients:
                    asyncio.run_coroutine_threadsafe(
                        self.forward_to_websockets(message, addr),
                        self.loop
                )

            except Exception as e:
                if self.listening:
                    print(f"Error receiving UDP message: {e}")
    
    async def forward_to_websockets(self, message, addr):
        if self.connected_clients:
            data = json.dumps({
                "type": "udp_message",
                "payload": message,
                "from": str(addr),
                "timestamp": asyncio.get_event_loop().time()
            })
            disconnected = set()
            for client in self.connected_clients:
                try:
                    print("Forwarding message to Websocket Clients")
                    await client.send(data)
                except Exception as e:
                    print(f"Failed to send to client: {e}")
                    disconnected.add(client)
            
            # Clean up disconnected clients
            self.connected_clients -= disconnected
    
    def set_message_handler(self, handler):
        self.messageHandler = handler
    
    def broadcast_udp_message(self, message):
        #Broadcast via UDP
        try: 
            if isinstance(message, str):
                message = message.encode("utf-8")

            self.udp_broadcast_sock.sendto(message, ('<broadcast>', self.broadPort))
            print(f"UDP message broadcasted to port {self.broadPort}: {message}")

        except Exception as e:
            print(f"Failed to broadcast UDP message: {e}")
        
    def send_udp_message(self, message, host, port):
        #Send UDP messages
        try:
            if isinstance(message, str):
                message = message.encode("utf-8")
            self.udp_broadcast_sock.sendto(message, (host, port))
            print(f"Sent UDP to {host}:{port}: {message.decode()}")

        except Exception as e:
            print(f"Failed to send UDP message: {e}")
    
    def stop(self):
        self.listening = False
        try:
            self.udp_receive_sock.close()
            self.udp_broadcast_sock.close()
            print("NetworkHandler stopped")
        except Exception as e:
            print(f"Error stopping NetworkHandler: {e}")



# ## Test function to simulate how this would work with your main.py
# async def test_integration():
#     print("Testing NetworkHandler with WebSocket simulation...")
    
#     # Create network handler
#     handler = NetworkHandler(recPort=7501, broadPort=7500, bufferSize=1024)
    
#     # Set the event loop for proper WebSocket forwarding
#     handler.set_event_loop(asyncio.get_running_loop())
    
#     # Simulate WebSocket clients
#     class MockWebSocket:
#         def __init__(self, name):
#             self.name = name
#             self.messages = []
        
#         async def send(self, message):
#             self.messages.append(message)
#             print(f"{self.name} received: {message}")
    
#     # Add mock WebSocket clients
#     client1 = MockWebSocket("Frontend Client 1")
#     client2 = MockWebSocket("Frontend Client 2")
#     handler.add_websocket_client(client1)
#     handler.add_websocket_client(client2)
    
#     # Start UDP receiver
#     handler.start_receiver()
    
#     # Wait for receiver to start
#     await asyncio.sleep(1)
    
#     # Test 1: Broadcast via WebSocket using main.py's broadcast style
#     print("\n--- Test 1: WebSocket Broadcast ---")
#     await handler.broadcast_message("Hello WebSocket clients!")
    
#     # Test 2: Send UDP message (should forward to WebSocket clients)
#     print("\n--- Test 2: UDP to WebSocket Forwarding ---")
#     handler.broadcast_udp_message("Test UDP message")
#     await asyncio.sleep(1)  # Allow time for forwarding
    
#     # Test 3: Direct UDP communication
#     print("\n--- Test 3: Direct UDP Communication ---")
#     handler.send_udp_message("Direct UDP test", "127.0.0.1", 7501)
#     await asyncio.sleep(1)
    
#     # Cleanup
#     handler.stop()
#     print("Test completed")


# if __name__ == "__main__":
#     # Run the test
#     asyncio.run(test_integration())
