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
        console.log("WebSocket CONNECTED")
      }

      ws.onclose = () => {
        setStatus("disconnected")
        console.log("WebSocket DISCONNECTED, retrying in 1s...")
        setTimeout(connect, 1000)
      }

      ws.onerror = (err) => {
        setStatus("error")
        console.error("WebSocket ERROR:", err)
      }

      ws.onmessage = (event) => {
        console.log("ActionScreen received message:", event.data)
      }
    }

    connect()
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  const sendGameCommand = (command) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected")
      alert("WebSocket is not connected. Please wait for connection.")
      return
    }

    try {
      const message = JSON.stringify({
        type: "player_entry",
        payload: command
      })
      socketRef.current.send(message)
      console.log(`Sent game command: ${command}`)
    } catch (error) {
      console.error("Error sending game command:", error)
      alert("Failed to send command")
    }
  }

  const handleManualStart = () => {
    sendGameCommand("202")
  }

  const handleManualStop = () => {
    sendGameCommand("221")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Action Screen</h1>

      <div className="absolute top-4 right-4">
        <WebsocketStatus status={status} />
      </div>

      <div className="flex gap-6 mb-8">
        <TeamScoreWindow teamColor="red" />
        <TeamScoreWindow teamColor="green" />
      </div>

      <div className="w-full max-w-4xl mb-6">
        <ActionsTerminal socketRef={socketRef} isConnected={status === "connected"} />
      </div>

      <div className="flex gap-4">
        <button
          className="px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 active:scale-95 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleManualStart}
          disabled={status !== "connected"}
        >
          Manual Start (202)
        </button>

        <button
          className="px-6 py-3 rounded-lg font-semibold bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleManualStop}
          disabled={status !== "connected"}
        >
          Manual Stop (221)
        </button>
      </div>

      {status !== "connected" && (
        <p className="mt-4 text-yellow-500 text-sm">
          Waiting for WebSocket connection...
        </p>
      )}
    </div>
  )
}