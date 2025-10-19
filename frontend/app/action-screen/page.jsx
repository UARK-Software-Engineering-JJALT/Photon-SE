"use client"
import { useEffect, useRef, useState } from "react"

export default function ActionScreen() {
  const [status, setStatus] = useState("connecting")
  const [messages, setMessages] = useState([])
  const [scores, setScores] = useState({ red: 0, green: 0 })
  const messagesEndRef = useRef(null)

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765")

    ws.onopen = () => setStatus("connected")
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "score_update") {
        setScores(data.payload)
      } else if (data.type === "new_message") {
        setMessages((prev) => [...prev, data.payload])
      }
    }
    ws.onclose = () => setStatus("disconnected")
    ws.onerror = (err) => {
      setStatus("error")
      console.error("Action Screen WebSocket error", err)
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Action Screen ({status})</h1>
      <div className="text-3xl mb-8">
        Score - Red: <span className="text-red-500">{scores.red}</span> | Green:{" "}
        <span className="text-green-500">{scores.green}</span>
      </div>
      <div className="w-3/4 h-1/3 overflow-y-auto border p-4 bg-gray-800 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
