"use client"
import { useState, useEffect } from "react"

export default function PlayerEntryForm({ onSubmit, editingPlayer }) {
  const [id, setId] = useState("")
  const [alias, setAlias] = useState("")
  const [team, setTeam] = useState("red")
  const [needsAlias, setNeedsAlias] = useState(false)

  useEffect(() => {
    if (editingPlayer) {
      setId(editingPlayer.id)
      setAlias(editingPlayer.alias)
      setTeam(editingPlayer.team)
      setNeedsAlias(!editingPlayer.alias)
    }
  }, [editingPlayer])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id) return alert("Player ID is required")
    if (needsAlias && !alias) return alert("Alias is required")

    onSubmit({
      id,
      alias,
      team,
      hardwareId: editingPlayer?.hardwareId || null, // keep existing hwid if any
    })

    // reset form
    setId("")
    setAlias("")
    setTeam("red")
    setNeedsAlias(false)
  }

  return (
    <form className="flex flex-col gap-3 p-4 border rounded-lg" onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Player ID"
          className="input"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <select className="select" value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="red">Red Team</option>
          <option value="green">Green Team</option>
        </select>
      </div>

      {needsAlias && (
        <input
          type="text"
          placeholder="Alias"
          className="input"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
      )}

      <button type="submit" className="btn btn-primary mt-2">
        {editingPlayer ? "Update Player" : "Add Player"}
      </button>
    </form>
  )
}
