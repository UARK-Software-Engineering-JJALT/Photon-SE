"use client"
import { useState, useEffect, useRef } from "react"
import { sendGameCommand } from "../action-screen/page.jsx"

export default function ActionsTerminal({ socketRef, isConnected }) {
  const terminalRef = useRef(null)
  const [actions, setActions] = useState([])

  useEffect(() => {
    
    if (!socketRef?.current || !isConnected) {
      return
    }

    const ws = socketRef.current

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "udp_message") {
          const payload = data.payload

          let actionText = ""

          if (payload.includes(":")) {
            const [shooter, target] = payload.split(":")
            actionText = `${shooter} HIT ${target}`
            sendGameCommand(target, socketRef)
            if(target % 2 == shooter % 2) {
              sendGameCommand(shooter, socketRef)
            }
          }
          else {
            actionText = payload
          }

          setActions(prev => {
            const newActions = [...prev, { text: actionText, id: Date.now() }]
            return newActions
          })
        } else {
          console.log("Non-UDP message type:", data.type)
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.addEventListener("message", handleMessage)

    return () => {
      ws.removeEventListener("message", handleMessage)
    }
  }, [socketRef, isConnected])

  useEffect(() => {
    const terminal = terminalRef.current
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight
    }
  }, [actions])

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-white font-semibold">Game Actions</h3>
        <button
          onClick={() => setActions([])}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
      <div
        ref={terminalRef}
        className="border-2 rounded-2xl border-white w-full h-40 overflow-auto bg-black/20 p-4 font-mono text-sm"
      >
        {actions.length === 0 ? (
          <p className="text-gray-500 italic">Waiting for game actions...</p>
        ) : (
          actions.map((action) => (
            <p key={action.id} className="text-white mb-2">
              {action.text}
            </p>
          ))
        )}
      </div>
    </div>
  )
}