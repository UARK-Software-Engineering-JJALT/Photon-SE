"use client"
import { useEffect, useRef, useState } from "react"
import SplashScreen from "./components/SplashScreen"
import TeamManager from "./components/TeamManager"
import WebsocketStatus from "./components/WebsocketStatus"
import ButtonSubmit from "./components/ButtonSubmit"
import { PlayersProvider } from "./utils/PlayersContext"

export default function Home() {
  const socketRef = useRef(null)
  const [status, setStatus] = useState("connecting")

  useEffect(() => {
    let ws

    const connect = () => {
      setStatus("connecting")
      ws = new WebSocket("ws://localhost:8765")
      socketRef.current = ws

      ws.onopen = () => {
        setStatus("connected")
        console.log("Connected to WebSocket")
      }

      ws.onclose = () => {
        setStatus("disconnected")
        console.log("Disconnected from WebSocket, retrying in 1s...")
        setTimeout(connect, 1000) // auto-reconnect after 1s
      }

      ws.onerror = (err) => {
        setStatus("error")
        console.error("WebSocket error", err)
      }
    }

    connect()


    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  return (
    <PlayersProvider>
      <div className="relative w-full h-screen flex flex-col items-center">
        <SplashScreen />

        <div>
          <div className="absolute top-4 right-4">
            <WebsocketStatus status={status} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-amber-500 mt-12">Enter Players</h1>
            <TeamManager socketRef={socketRef} />
            <div className="absolute bottom-0 justify-self-center">
              <div className="flex flex-row border rounded-lg">
                <ButtonSubmit text="Start Game" route="/countdown" onSubmit={(data) => console.log("Button pressed with data:", data)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlayersProvider>
  )
}
