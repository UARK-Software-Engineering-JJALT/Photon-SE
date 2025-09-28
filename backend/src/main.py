import asyncio
import websockets
import json
import sys
from network_handle import NetworkHandler

#First argument is the ip address for the udp host network
network_ip = sys.argv[1] if len(sys.argv) > 1 else "0.0.0.0"
print(f"Using UDP network IP: {network_ip}")

# Initialize NetworkHandler
network_handler = NetworkHandler(host=network_ip)
network_handler.start_receiver()

# Forward asyncio event loop
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
network_handler.set_event_loop(loop)

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
    ws_server = await websockets.serve(handle_client, network_ip, 8765)
    print(f"WebSocket server running on ws://{network_ip}:8765")
    await ws_server.wait_closed()

if __name__ == "__main__":
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        network_handler.stop()