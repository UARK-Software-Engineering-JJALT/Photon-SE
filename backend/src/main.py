import asyncio
import websockets
import json
import sys
from network_handle import NetworkHandler

#First argument is the ip address for the udp host network
websocket_ip = "0.0.0.0"
udp_network_ip = sys.argv[1] if len(sys.argv) > 1 else "0.0.0.0"

try:
    import socket
    socket.inet_aton(udp_network_ip)  # Validates IPv4 format
    print(f"Using UDP network IP: {udp_network_ip}")
except socket.error:
    print(f"Error: Invalid IP address format: {udp_network_ip}")
    print("Usage: python main.py [UDP_IP_ADDRESS]")
    print("Examples:")
    print("  python main.py 0.0.0.0        # Bind UDP to all interfaces (default)")
    print("  python main.py 10.3.1.53      # Bind UDP to specific interface")
    sys.exit(1)

# Initialize NetworkHandler
network_handler = NetworkHandler(host=udp_network_ip)
network_handler.start_receiver()

connected_clients = set()


async def broadcast_to_websockets(message: dict):
    if connected_clients:
        data = json.dumps(message)
        await asyncio.gather(*(client.send(data) for client in connected_clients))

async def handle_client(websocket):
    connected_clients.add(websocket)
    network_handler.add_websocket_client(websocket)
    try:
        async for raw_message in websocket:
            print("Received WebSocket message:", raw_message)
            try:
                message = json.loads(raw_message)
            except json.JSONDecodeError:
                await websocket.send(json.dumps({"type": "error", "message": "Invalid JSON"}))
                continue

            msg_type = message.get("type")
            payload = message.get("payload")

            if msg_type == "player_entry" and payload is not None:
                # Broadcast over UDP
                network_handler.broadcast_udp_message(str(payload))
                await websocket.send(json.dumps({"type": "ack", "payload": payload}))
            else:
                await websocket.send(json.dumps({"type": "error", "message": "Unknown message type"}))
    finally:
        connected_clients.remove(websocket)
        network_handler.remove_websocket_client(websocket)

async def main():
    network_handler.set_event_loop(asyncio.get_event_loop())
    
    ws_server = await websockets.serve(handle_client, websocket_ip, 8765)
    print(f"WebSocket server running on ws://{websocket_ip}:8765 (accessible via ws://localhost:8765)")
    print(f"UDP network using interface: {udp_network_ip}")
    await ws_server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        network_handler.stop()