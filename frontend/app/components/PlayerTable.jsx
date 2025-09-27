"use client"
import { useState } from "react"

export default function PlayerTable({ team, players, onRemove, onEdit }) {
    const [editingHardwareId, setEditingHardwareId] = useState(null) // store player id currently editing
    const [hardwareInput, setHardwareInput] = useState("")

    const startEdit = (player) => {
        setEditingHardwareId(player.id)
        setHardwareInput(player.hardwareId ?? "")
    }

    const saveHardwareId = (player) => {
        const hwIdInt = parseInt(hardwareInput)
        if (isNaN(hwIdInt)) {
            alert("Hardware ID must be a number")
            return
        }
        // Call parent onEdit with updated hardwareId
        onEdit(player.id, player.team, hwIdInt)
        setEditingHardwareId(null)
        setHardwareInput("")
    }

    return (
        <div className="flex-1 overflow-x-auto rounded-box border bg-black">
            <h2 className={`text-xl font-bold p-2 ${team === "red" ? "text-red-500" : "text-green-500"}`}>
                {team.charAt(0).toUpperCase() + team.slice(1)} Team
            </h2>
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Alias</th>
                        <th>Hardware ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p) => (
                        <tr key={`${p.team}-${p.id}`}>
                            <td>{p.id}</td>
                            <td>{p.alias}</td>
                            <td>
                                {editingHardwareId === p.id ? (
                                    <input
                                        type="number"
                                        className="input input-sm w-20"
                                        value={hardwareInput}
                                        onChange={(e) => setHardwareInput(e.target.value)}
                                    />
                                ) : (
                                    p.hardwareId ?? ""
                                )}
                            </td>
                            <td className="flex gap-2">
                                {editingHardwareId === p.id ? (
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => saveHardwareId(p)}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-xs btn-outline"
                                        onClick={() => startEdit(p)}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    className="btn btn-xs btn-error btn-outline"
                                    onClick={() => onRemove(p.id, p.team)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
