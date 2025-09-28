"use client"
import { useEffect, useState, useRef } from "react"

export default function WebSocketStatus() {
  const [status, setStatus] = useState("connecting")
  const socketRef = useRef(null)

  const connect = () => {
    setStatus("connecting")

    const ws = new WebSocket("ws://localhost:8765")
    socketRef.current = ws

    ws.onopen = () => {
      console.log("Connected to WebSocket")
      setStatus("connected")
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
      setStatus("disconnected")
    }

    ws.onerror = (err) => {
      console.error("WebSocket error", err)
      setStatus("error")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("Message:", data)
      } catch (e) {
        console.warn("Invalid JSON:", event.data)
      }
    }
  }

  useEffect(() => {
    connect()
    return () => socketRef.current?.close()
  }, [])

  const retryConnection = () => {
    if (
      status === "disconnected" ||
      status === "error" ||
      status === "connecting"
    ) {
      socketRef.current?.close()
      connect()
    }
  }

  return (
    <div className="flex justify-center items-center gap-3">
      {/* Status Icon */}
      {status === "connected" && (
        <div className="tooltip" data-tip="Connected to Backend">
          <span className="badge badge-success badge-xs"></span>
        </div>
      )}
      {status === "connecting" && (
        <div className="tooltip" data-tip="Connecting...">
          <span className="badge badge-warning badge-xs"></span>
        </div>
      )}
      {(status === "disconnected" || status === "error") && (
        <div className="tooltip" data-tip="Disconnected from Backend">
          <span className="badge badge-error badge-xs"></span>
        </div>
      )}

      {/* Status Text */}
      <span className="text-sm capitalize">{status}</span>

      {/* Retry Button */}
      {(status === "disconnected" || status === "error") && (
        <button
          onClick={retryConnection}
          className="btn btn-xs btn-outline"
        >
          Reconnect
        </button>
      )}
    </div>
  )
}
