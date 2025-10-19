"use client"
import { useEffect, useRef, useState } from "react"
import WebsocketStatus from "../components/WebsocketStatus"
import TeamScoreWindow from "../components/TeamScoreWindow"
import ActionsTerminal from "../components/ActionsTerminal"

export default function ActionScreen() {
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
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Action Screen</h1>
      <div className="absolute top-4 right-4">
        <WebsocketStatus status={status} />
      </div>
      <div className="flex">
        <TeamScoreWindow teamColor="red" />
        <TeamScoreWindow teamColor="green" />
      </div>
      <div>
        <ActionsTerminal socketRef={socketRef} />
      </div>



    </div>
  )
}
