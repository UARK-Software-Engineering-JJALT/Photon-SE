"use client"
import { useEffect, useRef } from "react"

export default function ActionsTerminal({ socketRef }) {
  const terminalRef = useRef(null)

  useEffect(() => {
    const terminal = terminalRef.current
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight
    }
  }, [])

  return (
    <div
      ref={terminalRef}
      className="border-2 rounded-2xl border-white w-2xl h-40 overflow-auto"
    >
      <p className="ml-4 mt-4">1 HIT 2</p>
      <p className="ml-4 mt-4">1 HIT 3</p>
      <p className="ml-4 mt-4">2 HIT 1</p>
      <p className="ml-4 mt-4">3 HIT 5</p>
      <p className="ml-4 mt-4">3 HIT 7</p>
      <p className="ml-4 mt-4">4 HIT 5</p>
      <p className="ml-4 mt-4">3 HIT 4</p>
    </div>
  )
}
