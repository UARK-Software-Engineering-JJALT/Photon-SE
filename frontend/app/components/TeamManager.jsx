"use client"
import { useState, useEffect } from "react"
import PlayerTable from "./PlayerTable"
import PlayerEntryForm from "./PlayerEntryForm"

export default function TeamManager() {
  const [players, setPlayers] = useState([])
  const [editingPlayer, setEditingPlayer] = useState(null)

  // Fetch all players initially
  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then(setPlayers)
      .catch(console.error)
  }, [])

  const handlePlayerSubmit = async (id, alias, setNeedsAlias) => {
    try {
      if (editingPlayer) {
        // update
        const res = await fetch(`/api/players/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alias }),
        })
        const updated = await res.json()
        setPlayers((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        )
        setEditingPlayer(null)
      } else {
        // check if player exists
        const getRes = await fetch(`/api/players/${id}`)
        if (getRes.ok) {
          const existing = await getRes.json()
          setPlayers((prev) => [...prev, existing])
        } else {
          if (!alias) {
            setNeedsAlias(true) // prompt user
            return
          }
          // add new
          const res = await fetch("/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, alias }),
          })
          const newPlayer = await res.json()
          setPlayers((prev) => [...prev, newPlayer])
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/players/${id}`, { method: "DELETE" })
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (id) => {
    const player = players.find((p) => p.id === id)
    if (player) setEditingPlayer(player)
  }

  return (
    <div>
      <PlayerEntryForm
        onSubmit={handlePlayerSubmit}
        initialId={editingPlayer?.id || ""}
        initialAlias={editingPlayer?.alias || ""}
      />
      <PlayerTable
        players={players}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />
    </div>
  )
}
