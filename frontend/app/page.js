"use client"
import { useEffect, useState } from "react"
import SplashScreen from "./components/SplashScreen"
import TeamManager from "./components/TeamManager"
import WebsocketStatus from "./components/WebsocketStatus"

export default function Home() {
  const [socket, setSocket] = useState(null)
  const [status, setStatus] = useState("connecting")

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765")
    setSocket(ws)

    ws.onopen = () => {
      setStatus("connected")
      console.log("Connected to WebSocket")
    }

    ws.onclose = () => {
      setStatus("disconnected")
      console.log("Disconnected from WebSocket")
    }

    ws.onerror = (err) => {
      setStatus("error")
      console.error("WebSocket error", err)
    }

    return () => ws.close()
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center">
      <SplashScreen />

      <div className="absolute top-4 right-4">
        <WebsocketStatus status={status} />
      </div>

      <h1 className="text-4xl font-bold text-amber-500 mt-12">Enter Players</h1>
      <TeamManager socket={socket} />
    </div>
  )
}
