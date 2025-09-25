# src/main.py
import asyncio
import websockets

# TODO Allow client to be changeable from 127.0.0.1 default to inputted by user optionally
# Seems this script will grab the port 8765 broadcast and then pass it over to Tristan?

connected_clients = set()
game_running = True

async def broadcast(message: str):
    if connected_clients:
        # The only connected client is going to be the frontend
        await asyncio.gather(*(client.send(message) for client in connected_clients))

async def handle_client(websocket):
    global game_running
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            if message == "start":
                if not game_running:
                    game_running = True
                    # TODO import and put Tristan's code here that will start the game
                    # TODO Make some normal 
                    asyncio.create_task()
                    await broadcast("Game started")
            elif message == "stop":
                game_running = False
                await broadcast("Game stopped")
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server running on ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())