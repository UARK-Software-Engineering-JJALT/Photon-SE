"use client"
import { useState } from "react"

export default function PlayerEntryForm({ onSubmit, initialId = "", initialAlias = "" }) {
  const [id, setId] = useState(initialId)
  const [alias, setAlias] = useState(initialAlias)
  const [needsAlias, setNeedsAlias] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!id.trim()) return
    onSubmit(id.trim(), alias || null, setNeedsAlias)
    setId("")
    setAlias("")
  }

  return (
    <form className="flex gap-3 m-5" onSubmit={handleSubmit}>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Player ID"
        className="input"
      />
      {(needsAlias || initialAlias) && (
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Enter Alias"
          className="input"
        />
      )}
      <button className="btn" type="submit">
        {needsAlias ? "Save Alias" : "Enter"}
      </button>
    </form>
  )
}
