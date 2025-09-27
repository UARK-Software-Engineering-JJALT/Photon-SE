"use client"
import { useEffect, useRef, useState } from "react"

export default function WebSocketClient() {
  const [messages, setMessages] = useState([])
  const ws = useRef(null)

  useEffect(() => {
    // Connect to the WebSocket server
    ws.current = new WebSocket("ws://localhost:8765")

    ws.current.onopen = () => {
      console.log("✅ Connected to WebSocket server")
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("📩 Message received:", data)
        setMessages((prev) => [...prev, data])
      } catch (err) {
        console.error("Error parsing message:", err)
      }
    }

    ws.current.onclose = () => {
      console.log("❌ Disconnected from WebSocket server")
    }

    return () => {
      ws.current.close()
    }
  }, [])

  const sendMessage = (type, message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, message }))
    }
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">WebSocket Client</h1>
      <div className="space-x-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => sendMessage("start", "Start the game!")}
        >
          Start
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => sendMessage("stop", "Stop the game!")}
        >
          Stop
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => sendMessage("message", "Hello from frontend!")}
        >
          Send Message
        </button>
      </div>
      <div className="mt-4">
        <h2 className="font-semibold">Messages:</h2>
        <ul className="list-disc pl-5">
          {messages.map((msg, i) => (
            <li key={i}>{msg.type}: {msg.message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
