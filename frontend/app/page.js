"use client"
import { useEffect, useRef, useState } from "react"
import SplashScreen from "./components/SplashScreen"
import TeamManager from "./components/TeamManager"
import WebsocketStatus from "./components/WebsocketStatus"

export default function Home() {
  const [status, setStatus] = useState("connecting")
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765")
    socketRef.current = socket

    socket.onopen = () => {
      setStatus("connected")
      console.log("Connected to Websocket")
    }
    socket.onclose = () => {
      setStatus("disconnected")
      console.log("Disconnected from Websocket")
    }
    socket.onerror = () => setStatus("error")

    return () => socket.close()
  }, [])

  return (
    <div className="relative w-full h-screen flex flex-col items-center">
      <SplashScreen />

      <div className="absolute top-4 right-4">
        <WebsocketStatus status={status} />
      </div>

      <h1 className="text-4xl font-bold text-amber-500 mt-12">Enter Players</h1>
      <TeamManager socket={socketRef.current} />
    </div>
  )
}
