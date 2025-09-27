# src/main.py
import asyncio
import websockets

# TODO Allow client to be changeable from 127.0.0.1 default to inputted by user optionally
# Seems this script will grab the port 8765 broadcast and then pass it over to Tristan?

connected_clients = set()
game_running = True

async def broadcast(message: dict):
    if connected_clients:
        # The only connected client is going to be the frontend
        await asyncio.gather(*(client.send(message) for client in connected_clients))

async def handle_client(websocket):
    global game_running
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # We are working with a payload that looks like (example):
            '''
            {
                type: "start",
                message: "12:51"
            }
            '''
            print("Message gotten!: ", message)
            messageType = message[0]["type"]

            # Assume the input is valid (I know.) and start a task
            asyncio.create_task()
            if messageType == "message":
                await broadcast({"type": "message", "message": "Message gotten."})
            elif messageType == "start":
                if not game_running:
                    game_running = True
                    # TODO import and put Tristan's code here that will start the game
                    # TODO Make some normal 
                    await broadcast({"type": "message", "message": "Game Started!"})
                else:
                    await broadcast({"type": "message", "message": "Game Already Started!"})
            elif messageType == "stop":
                game_running = False
                await broadcast({"type": "message", "message": "Game Stopped!"})
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Server running on ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())