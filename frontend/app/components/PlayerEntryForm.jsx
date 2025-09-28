"use client"
import { useState } from "react"

export default function PlayerEntryForm({ onSubmit }) {
  const [id, setId] = useState("")
  const [alias, setAlias] = useState("")
  const [team, setTeam] = useState("red") // persist between submits
  const [showAliasModal, setShowAliasModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id) return alert("Player ID is required")

    try {
      // Check if player exists in DB
      const res = await fetch(`/api/players/${id}`)
      console.log(res)
      if (res.ok) {
        const existing = await res.json()
        console.log(existing)
        onSubmit({
          id: existing.id,
          alias: existing.alias,
          team,
          hardwareId: null,
        })
        setId("")
      } else {
        // Not found, need alias
        setShowAliasModal(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAliasSubmit = () => {
    if (!alias) return alert("Alias is required")
    onSubmit({ id, alias, team, hardwareId: null })
    setId("")
    setAlias("")
    setShowAliasModal(false)
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Player ID"
            className="input input-bordered"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          {/*toggle for team */}
          <div className="form-control">
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text text-red-600">Red</span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={team === "green"}
                onChange={(e) => setTeam(e.target.checked ? "green" : "red")}
              />
              <span className="label-text text-green-600">Green</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add to {team === "red" ? "Red" : "Green"} Team
        </button>
      </form>

      {/* Alias Modal */}
      {showAliasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-3">Enter Alias</h3>
            <input
              type="text"
              placeholder="Alias"
              className="input input-bordered w-full"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAliasModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAliasSubmit}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
